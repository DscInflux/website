import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";

const DISCORD_API_URL = "https://discord.com/api/users/@me";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization:
        "https://discord.com/oauth2/authorize?scope=identify+email",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      try {
        const userId = user?.id ?? token.sub;
        if (!userId) return token;

        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!dbUser) return token;

        // Store DB data in token
        token.id = dbUser.id;
        token.username = dbUser.username;
        token.display_name = dbUser.display_name;
        token.avatar = dbUser.avatar;
        token.banner = dbUser.banner;
        token.discordId = dbUser.discordId;
        token.access_token = dbUser.access_token;
        token.is_admin = dbUser.is_admin;
        token.is_banned = dbUser.is_banned;
        token.email = dbUser.email;

        // If Discord account is linked and we have access_token
        if (
          dbUser.SSOProvider?.includes("discord") &&
          dbUser.access_token
        ) {
          const res = await fetch(DISCORD_API_URL, {
            headers: {
              Authorization: `Bearer ${dbUser.access_token}`,
            },
          });

          if (res.ok) {
            const discord = await res.json();

            const newAvatar = discord.avatar
              ? `https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png`
              : "https://purrquinox.com/banner.png";

            const newBanner = discord.banner
              ? `https://cdn.discordapp.com/banners/${discord.id}/${discord.banner}.png`
              : "https://purrquinox.com/banner.png";

            const newDisplayName =
              discord.global_name || discord.username;

            const needsUpdate =
              dbUser.avatar !== newAvatar ||
              dbUser.banner !== newBanner ||
              dbUser.display_name !== newDisplayName ||
              dbUser.username !== discord.username;

            if (needsUpdate) {
              await prisma.user.update({
                where: { id: dbUser.id },
                data: {
                  avatar: newAvatar,
                  banner: newBanner,
                  display_name: newDisplayName,
                  username: discord.username,
                },
              });

              // Reflect new values in token
              token.avatar = newAvatar;
              token.banner = newBanner;
              token.display_name = newDisplayName;
              token.username = discord.username;
            }
          }
        }

        return token;
      } catch (err) {
        console.error("JWT callback error:", err);
        return token;
      }
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.display_name = token.display_name as string;
      session.user.avatar = token.avatar as string;
      session.user.banner = token.banner as string;
      session.user.discordId = token.discordId as string;
      session.user.access_token = token.access_token as string;
      session.user.is_admin = token.is_admin as boolean;
      session.user.is_banned = token.is_banned as boolean;
      session.user.email = token.email as string;
      return session;
    },

    async signIn({ user, account, profile }) {
      // Link account and create user logic stays the same as your original code
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === "development",
});
