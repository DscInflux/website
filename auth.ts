import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import type { Account, Profile, User as NextAuthUser, Session } from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: "https://discord.com/oauth2/authorize?scope=identify email",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
      profile(profile) {
        // Twitter's profile response is under profile.data
        const data = profile.data;
        return {
          id: String(data.id || ""),
          username: data.username || (typeof data.name === "string" ? data.name.replace(/\s+/g, "_").toLowerCase() : "twitter_user"),
          display_name: data.name || data.username || "Twitter User",
          avatar: data.profile_image_url || "",
          email: data.email || undefined,
          mfa_enabled: false,
          token: "",
          access_token: "",
          is_banned: false,
          is_admin: false,
          SSOProvider: ["twitter"],
          banner:  "",
        };
      },
    }),
  ],
  callbacks: {
    async signIn(params) {
      const { user, account, profile } = params;
      if (account?.provider && profile) {
        let providerName = account.provider;
        let upsertData: any = {};
        let providerId = "";

        if (providerName === "discord") {
          const discordProfile = profile as {
            id: string;
            username: string;
            global_name?: string;
            avatar?: string;
            email?: string;
            banner?: string;
          };
          providerId = discordProfile.id;
          upsertData = {
            username: discordProfile.username,
            display_name: discordProfile.global_name || discordProfile.username,
            avatar: discordProfile.avatar
              ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
              : undefined,
            email: discordProfile.email ?? undefined,
            discordId: discordProfile.id,
            SSOProvider: ["discord"],
            banner: discordProfile.banner || ""
          };
        } else if (providerName === "github") {
          const githubProfile = profile as {
            id: string | number;
            login: string;
            avatar_url?: string;
            email?: string;
          };
          providerId = String(githubProfile.id);
          upsertData = {
            username: githubProfile.login,
            display_name: githubProfile.login,
            avatar: githubProfile.avatar_url,
            email: githubProfile.email ?? undefined,
            // Use GitHub ID as discordId since it's required
            discordId: `github_${githubProfile.id}`,
            SSOProvider: ["github"],
            banner: ""
          };
        } else if (providerName === "twitter") {
          const twitterProfile = profile as {
            id: string | number;
            name?: string;
            username?: string;
            profile_image_url?: string;
            email?: string;
            profile_banner_url?: string;
          };
          providerId = String(twitterProfile.id);
          upsertData = {
            username:
              twitterProfile.username ||
              (typeof twitterProfile.name === "string"
                ? twitterProfile.name.replace(/\s+/g, "_").toLowerCase()
                : "twitter_user"),
            display_name: twitterProfile.name || twitterProfile.username || "Twitter User",
            avatar: twitterProfile.profile_image_url,
            email: twitterProfile.email ?? undefined,
            // Use Twitter ID as discordId since it's required
            discordId: `twitter_${twitterProfile.id}`,
            SSOProvider: ["twitter"],
            banner: twitterProfile.profile_banner_url || ""
          };
        }

        // Check for existing user by email first
        let existingUser = null;
        if (upsertData.email) {
          existingUser = await prisma.user.findUnique({ 
            where: { email: upsertData.email } 
          });
        }

        // If not found by email, check by discordId
        if (!existingUser && upsertData.discordId) {
          existingUser = await prisma.user.findUnique({ 
            where: { discordId: upsertData.discordId } 
          });
        }

        if (existingUser) {
          // Update existing user's SSO providers if needed
          const currentProviders: string[] = Array.isArray(existingUser.SSOProvider)
            ? existingUser.SSOProvider
            : typeof existingUser.SSOProvider === "string" && existingUser.SSOProvider
              ? [existingUser.SSOProvider]
              : [];
          
          const newProvider = upsertData.SSOProvider[0];
          if (!currentProviders.includes(newProvider)) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                SSOProvider: { set: [...currentProviders, newProvider] },
              },
            });
          }
        } else {
          // Create new user
          let newUserId = user.id;
          if (providerName === "discord") {
            newUserId = providerId;
          } else if (providerName === "github") {
            newUserId = providerId;
          } else if (providerName === "twitter") {
            newUserId = providerId;
          }

          await prisma.user.create({
            data: {
              id: newUserId,
              ...upsertData,
              access_token: typeof account?.access_token === "string" ? account.access_token : "",
              token: typeof account?.refresh_token === "string" ? account.refresh_token : "",
              mfa_enabled: false,
              is_banned: false,
              is_admin: false,
            },
          });
        }
      }
      return true;
    },

    async jwt({ token, account, user, profile }: { 
      token: any; 
      account?: Account | null; 
      user?: NextAuthUser; 
      profile?: Profile | undefined; 
    }) {
      let dbUser = null;
      if (user && user.id) {
        dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      } else if (token && token.id) {
        dbUser = await prisma.user.findUnique({ where: { id: token.id } });
      }

      if (dbUser) {
        token.is_banned = dbUser.is_banned ?? false;
        token.is_admin = dbUser.is_admin ?? false;
        token.avatar = dbUser.avatar ?? token.avatar ?? "";
        token.username = dbUser.username ?? token.username ?? "";
        token.display_name = dbUser.display_name ?? token.display_name ?? "";
      } else {
        token.is_banned = false;
        token.is_admin = false;
      }

      if (account && user) {
        token.access_token = account.access_token ?? "";
        token.id = user.id;

        // Set profile-specific data
        if (account.provider === "discord" && profile) {
          const discordProfile = profile as {
            id: string;
            username: string;
            global_name?: string;
            avatar?: string;
          };
          token.avatar = discordProfile.avatar && discordProfile.id
            ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
            : undefined;
          token.username = discordProfile.username;
          token.display_name = discordProfile.global_name || discordProfile.username;
        } else if (account.provider === "github" && profile) {
          const githubProfile = profile as {
            avatar_url?: string;
            login?: string;
          };
          token.avatar = githubProfile.avatar_url;
          token.username = githubProfile.login;
          token.display_name = githubProfile.login;
        } else if (account.provider === "twitter" && profile) {
          const twitterProfile = profile as {
            profile_image_url?: string;
            username?: string;
            name?: string;
          };
          token.avatar = twitterProfile.profile_image_url;
          token.username = twitterProfile.username || twitterProfile.name;
          token.display_name = twitterProfile.name || twitterProfile.username;
        }
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.access_token = token.access_token;
        session.user.avatar = typeof token.avatar === "string" && token.avatar
          ? token.avatar
          : typeof token.image === "string"
            ? token.image
            : "";
        session.user.display_name = typeof token.display_name === "string" && token.display_name
          ? token.display_name
          : typeof token.name === "string"
            ? token.name
            : "";
        session.user.username = typeof token.username === "string" && token.username
          ? token.username
          : typeof token.login === "string"
            ? token.login
            : "";
        session.user.is_banned = token.is_banned ?? false;
        session.user.is_admin = token.is_admin ?? false;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
});