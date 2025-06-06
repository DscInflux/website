import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GitHubProvider from 'next-auth/providers/github';
import TwitterProvider from 'next-auth/providers/twitter';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import type { Account, Profile, User as NextAuthUser, Session } from 'next-auth';
import { Presence } from './node_modules/.prisma/client/index.d';

export const { auth, handlers, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID || '',
			clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
			authorization: 'https://discord.com/oauth2/authorize?scope=identify+email'
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID || '',
			clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
		}),
		TwitterProvider({
			clientId: process.env.TWITTER_CLIENT_ID || '',
			clientSecret: process.env.TWITTER_CLIENT_SECRET || ''
		})
	],
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			if (!account || !profile) return true;

			try {
				const providerAccountId = String(profile.id || account.providerAccountId);
				const provider = account.provider;

				// Check if this provider account already exists
				const existingAccount = await prisma.account.findUnique({
					where: {
						provider_providerAccountId: {
							provider: provider,
							providerAccountId: providerAccountId
						}
					},
					include: {
						user: true
					}
				});

				if (existingAccount) {
					// Account exists - allow sign in
					console.log(`Existing account found for ${provider}:${providerAccountId}`);
					return true;
				}

				// No existing account - check if user exists by email
				let targetUser = null;
				if (user.email) {
					targetUser = await prisma.user.findUnique({
						where: { email: user.email }
					});
				}

				// Prepare user data based on provider
				let userData: any = {
					access_token: account.access_token || '',
					token: account.refresh_token || '',
					mfa_enabled: false,
					is_banned: false,
					is_admin: false
				};

				if (provider === 'discord') {
					const discordProfile = profile as {
						id: string;
						username: string;
						global_name?: string;
						avatar?: string;
						email?: string;
						banner?: string;
					};

					userData = {
						...userData,
						username: discordProfile.username,
						display_name: discordProfile.global_name || discordProfile.username,
						avatar: discordProfile.avatar
							? `https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.png`
							: 'https://purrquinox.com/banner.png',
						email: discordProfile.email,
						discordId: discordProfile.id,
						SSOProvider: ['discord'],
						banner: discordProfile.banner
							? `https://cdn.discordapp.com/banners/${discordProfile.id}/${discordProfile.banner}.png`
							: 'https://purrquinox.com/banner.png'
					};
				} else if (provider === 'github') {
					const githubProfile = profile as {
						id: string | number;
						login: string;
						avatar_url?: string;
						email?: string;
					};

					userData = {
						...userData,
						username: githubProfile.login,
						display_name: githubProfile.login,
						avatar: githubProfile.avatar_url || '',
						email: githubProfile.email,
						discordId: `github_${githubProfile.id}`,
						SSOProvider: ['github'],
						banner: ''
					};
				} else if (provider === 'twitter') {
					// Handle Twitter's profile structure correctly
					const twitterProfile = profile as {
						data: {
							id: string;
							name?: string;
							username?: string;
							profile_image_url?: string;
							email?: string;
							profile_banner_url?: string;
						};
					};

					// Extract data from the nested structure
					const twitterData = twitterProfile.data;

					userData = {
						...userData,
						username: twitterData.username || `twitter_user_${twitterData.id}`,
						display_name:
							twitterData.name || twitterData.username || `Twitter User ${twitterData.id}`,
						avatar: twitterData.profile_image_url || '',
						email: twitterData.email || null,
						discordId: `twitter_${twitterData.id}`,
						SSOProvider: ['twitter'],
						banner: twitterData.profile_banner_url || ''
					};
				}

				// Ensure username is never undefined
				if (!userData.username) {
					userData.username = `${provider}_user_${providerAccountId}`;
				}

				// Ensure display_name is never undefined
				if (!userData.display_name) {
					userData.display_name = userData.username;
				}

				if (targetUser) {
					// User exists - update their info and link the new provider
					const currentProviders: string[] = Array.isArray(targetUser.SSOProvider)
						? targetUser.SSOProvider
						: typeof targetUser.SSOProvider === 'string' && targetUser.SSOProvider
							? [targetUser.SSOProvider]
							: [];

					const newProvider = userData.SSOProvider[0];
					const updatedProviders = currentProviders.includes(newProvider)
						? currentProviders
						: [...currentProviders, newProvider];

					await prisma.user.update({
						where: { id: targetUser.id },
						data: {
							...userData,
							SSOProvider: updatedProviders
						}
					});

					// Create the account link
					await prisma.account.create({
						data: {
							userId: targetUser.id,
							type: account.type,
							provider: account.provider,
							providerAccountId: providerAccountId,
							refresh_token: account.refresh_token,
							access_token: account.access_token,
							expires_at: account.expires_at,
							token_type: account.token_type,
							scope: account.scope,
							id_token: account.id_token,
							session_state: account.session_state != null ? String(account.session_state) : null
						}
					});
				} else {
					// Create new user
					const newUser = await prisma.user.create({
						data: {
							id: user.id || providerAccountId,
							...userData
						}
					});

					// Create the account link
					await prisma.account.create({
						data: {
							userId: newUser.id,
							type: account.type,
							provider: account.provider,
							providerAccountId: providerAccountId,
							refresh_token: account.refresh_token,
							access_token: account.access_token,
							expires_at: account.expires_at,
							token_type: account.token_type,
							scope: account.scope,
							id_token: account.id_token,
							session_state: account.session_state != null ? String(account.session_state) : null,
						}
					});
				}

				return true;
			} catch (error) {
				console.error('SignIn callback error:', error);
				return false;
			}
		},

		async jwt({ token, account, user, profile }) {
			// Get user data from database
			let dbUser = null;
			if (user?.id) {
				dbUser = await prisma.user.findUnique({ where: { id: user.id } });
			} else if (token?.sub) {
				dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
			}

			if (dbUser) {
				token.id = dbUser.id;
				token.is_banned = dbUser.is_banned ?? false;
				token.is_admin = dbUser.is_admin ?? false;
				token.avatar = dbUser.avatar ?? '';
				token.username = dbUser.username ?? '';
				token.display_name = dbUser.display_name ?? '';
				token.email = dbUser.email ?? '';
				token.access_token = dbUser.access_token ?? '';
				token.discordId = dbUser.discordId ?? '';
			}

			if (account) {
				token.access_token = account.access_token ?? token.access_token ?? '';
			}

			return token;
		},

		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.access_token = token.access_token as string;
				session.user.avatar = token.avatar as string;
				session.user.display_name = token.display_name as string;
				session.user.username = token.username as string;
				session.user.is_banned = token.is_banned as boolean;
				session.user.is_admin = token.is_admin as boolean;
				session.user.email = token.email as string;
				session.user.discordId = token.discordId as string;
			}
			return session;
		}
	},
	pages: {
		signIn: '/auth/signin',
		error: '/auth/error'
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60 // 30 days
	},
	debug: process.env.NODE_ENV === 'development'
});
