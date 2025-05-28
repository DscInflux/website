import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import { prisma } from "@/lib/db/prisma";
import type {
  Account,
  Profile,
  User as NextAuthUser,
  Session,
} from "next-auth";

const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization:
        "https://discord.com/oauth2/authorize?scope=identify email",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: NextAuthUser;
      account: Account | null;
      profile?: Profile | undefined;
    }) {
      if (account?.provider && profile) {
        let providerName = account.provider;
        let upsertData: any = {};
        if (providerName === "discord") {
          const discordProfile = profile as {
            id: string;
            username: string;
            global_name?: string;
            avatar?: string;
            email?: string;
            banner?: string;
          };
          upsertData = {
            username: discordProfile.username,
            display_name: discordProfile.global_name || discordProfile.username,
            avatar: discordProfile.avatar
              ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
              : undefined,
            email: discordProfile.email ?? undefined,
            discordId: discordProfile.id,
            SSOProvider: "discord",
          };
        } else if (providerName === "github") {
          const githubProfile = profile as { id: string | number; login: string; avatar_url?: string; email?: string };
          upsertData = {
            username: githubProfile.login,
            display_name: githubProfile.login,
            avatar: githubProfile.avatar_url,
            email: githubProfile.email ?? undefined,
            discordId: String(githubProfile.id), // Ensure string type
            SSOProvider: "github",
          };
        } else if (providerName === "twitter") {
          const twitterProfile = profile as { id: string | number; name: string; username?: string; profile_image_url?: string; email?: string };
          upsertData = {
            username: twitterProfile.username || twitterProfile.name,
            display_name: twitterProfile.name,
            avatar: twitterProfile.profile_image_url,
            email: twitterProfile.email ?? undefined,
            discordId: String(twitterProfile.id), // Ensure string type
            SSOProvider: "twitter",
          };
        }
        await prisma.user.upsert({
          where: { id: user.id },
          update: upsertData,
          create: {
            id: user.id,
            ...upsertData,
            access_token: typeof account?.access_token === "string" ? account.access_token : "",
            token: typeof account?.refresh_token === "string" ? account.refresh_token : "",
            locale: "",
            mfa_enabled: false,
            banner: "",
            is_banned: false,
            is_admin: false,
          },
        });
      }
      return true;
    },
    async jwt({
      token,
      account,
      user,
      profile,
    }: {
      token: any;
      account?: Account | null;
      user?: NextAuthUser;
      profile?: Profile | undefined;
    }) {
      const discordProfile = profile as {
        id?: string;
        username?: string;
        global_name?: string;
        avatar?: string;
      };
      let dbUser = null;
      if (user && user.id) {
        dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      } else if (token && token.id) {
        dbUser = await prisma.user.findUnique({ where: { id: token.id } });
      }
      if (dbUser) {
        token.is_banned = dbUser.is_banned ?? false;
        token.is_admin = dbUser.is_admin ?? false;
      } else {
        token.is_banned = user?.is_banned ?? false;
        token.is_admin = user?.is_admin ?? false;
      }
      if (account && user) {
        token.access_token = account.access_token ?? "";
        token.id = user.id;
        if (discordProfile) {
          token.avatar =
            discordProfile.avatar && discordProfile.id
              ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
              : undefined;
          token.username = discordProfile.username;
          token.display_name =
            discordProfile.global_name || discordProfile.username;
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.access_token = token.access_token;
        // Use token.avatar if available, else fallback to token.image
        session.user.avatar = typeof token.avatar === "string" && token.avatar
          ? token.avatar
          : (typeof token.image === "string" ? token.image : "");
        // Use display_name, fallback to name
        session.user.display_name = typeof token.display_name === "string" && token.display_name
          ? token.display_name
          : (typeof token.name === "string" ? token.name : "");
        // Use username if available, else fallback to login
        session.user.username = typeof token.username === "string" && token.username
          ? token.username
          : (typeof token.login === "string" ? token.login : "");
        session.user.is_banned = token.is_banned ?? false;
        session.user.is_admin = token.is_admin ?? false;
      }
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
};

export { authOptions };
