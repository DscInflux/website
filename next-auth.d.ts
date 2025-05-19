import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User;
  }

  interface User {
    accent_color: number;
    avatar: string;
    avatar_decoration: any;
    banner: any;
    banner_color: string;
    flags: number;
    locale: string;
    mfa_enabled: boolean;
    premium_type: number;
    public_flags: number;
    token: string;
    access_token: string;
    is_banned: boolean;
    is_admin: boolean;
    appId: any;
    entity: any;
    id: string;
    username: string;
    display_name: string;
    email?: string;
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    access_token: string;
  }
}
