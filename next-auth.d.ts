import NextAuth from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: User;
	}

	interface User {
		avatar: string;
		banner: any;
		token: string;
		access_token: string;
		is_banned: boolean;
		is_admin: boolean;
		id: string;
		username: string;
		display_name: string;
		email?: string;
		SSOProvider: string | string[];
		discordId?: string;
		emailVerified?: Date | null;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		access_token: string;
	}
}
