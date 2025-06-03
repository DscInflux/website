export interface User {
  avatar: string;
  banner: any;
  locale: string;
  mfa_enabled: boolean;
  token: string;
  access_token: string;
  is_banned: boolean;
  is_admin: boolean;
  id: string;
  username: string;
  display_name: string;
  SSOProvider: string;
  emailVerified: Date | null;
  email: string;
}
