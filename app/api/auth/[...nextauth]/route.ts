import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
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
      const discordProfile = profile as {
        id: string;
        username: string;
        global_name?: string;
        avatar?: string;
        email?: string;
        banner?: string;
      };
      if (account?.provider === "discord" && discordProfile) {
        await prisma.user.upsert({
          where: { discordId: discordProfile.id },
          update: {
            username: discordProfile.username,
            display_name: discordProfile.global_name || discordProfile.username,
            avatar: discordProfile.avatar
              ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
              : undefined,
            email: discordProfile.email ?? undefined,
            discordId: discordProfile.id,
          },
          create: {
            id: user.id,
            username: discordProfile.username,
            display_name: discordProfile.global_name || discordProfile.username,
            avatar: discordProfile.avatar
              ? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
              : undefined,
            email: discordProfile.email ?? undefined,
            discordId: discordProfile.id,
            accent_color: 0,
            access_token:
              typeof account?.access_token === "string"
                ? account.access_token
                : "",
            token:
              typeof account?.refresh_token === "string"
                ? account.refresh_token
                : "",
            premium_type: 0,
            flags: 0,
            locale: "",
            mfa_enabled: false,
            public_flags: 0,
            banner: discordProfile.banner
              ? `https://cdn.discordapp.com/banners/${discordProfile.id}/${discordProfile.banner}.png`
              : "",
            banner_color: "",
            avatar_decoration: "",
            is_banned: false,
            is_admin: false,
            appId: "",
            entity: "",
            isRevolt: false,
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
        session.user.avatar =
          typeof token.avatar === "string" ? token.avatar : "";
        session.user.username =
          typeof token.username === "string" ? token.username : "";
        session.user.display_name =
          typeof token.display_name === "string" ? token.display_name : "";
      }
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
