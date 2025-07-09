'use client';

import { motion } from 'framer-motion';
import {
	Heart,
	Briefcase,
	Users,
	Languages,
	Zap,
	ExternalLink,
	Eye,
	Crown,
	Calendar,
	Globe
} from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { Entity } from '@/types/entity';
import { Code, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export default function UserProfile({ username }: { username: string }) {
	const { data: session } = useSession();
	const user = session?.user || null;
	const queryClient = useQueryClient();

	// Fetch user profile data
	const {
		data,
		isLoading: loading,
		error
	} = useQuery<Entity, Error>({
		queryKey: ['user-profile', username],
		queryFn: async () => {
			const response = await fetch(`/api/get/entity?name=${username}`);
			if (!response.ok) throw new Error('Failed to fetch user data');
			return response.json();
		},
		staleTime: 60 * 1000, // 1 minute
		refetchOnWindowFocus: false
	});

	// Like/unlike mutation
	const likeMutation = useMutation({
		mutationFn: async (action: 'like' | 'unlike') => {
			if (!data) throw new Error('No user data');
			const res = await fetch(`/api/post/entity/heart?action=${action}&url=${data.url}`, {
				method: 'POST'
			});
			return res.json();
		},
		onSuccess: (_, action) => {
			queryClient.invalidateQueries({ queryKey: ['user-profile', username] });
		}
	});

	// Set liked and likes count
	const liked = data && user ? data.likes?.includes(user.id) : false;
	const likes = data?.likes?.length || 0;

	const toggleLike = () => {
		if (!data || likeMutation.isPending) return;
		likeMutation.mutate(liked ? 'unlike' : 'like');
	};

	if (loading) {
		return (
			<div className="bg-light dark:bg-dark flex min-h-screen items-center justify-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{
						duration: 1,
						repeat: Number.POSITIVE_INFINITY,
						ease: 'linear'
					}}
					className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
				/>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="bg-light dark:bg-dark flex min-h-screen items-center justify-center">
				<div className="dark:bg-dark mx-auto max-w-md rounded-xl bg-white bg-opacity-50 p-8 text-center shadow-lg backdrop-blur-sm dark:bg-opacity-50">
					<h1 className="mb-4 text-2xl font-bold text-primary">User Not Found</h1>
					<p className="text-gray-600 dark:text-gray-300">
						{error?.message || "The user you're looking for doesn't exist or has been removed."}
					</p>
				</div>
			</div>
		);
	}

	const formatDate = (dateString: Date | undefined) => {
		if (!dateString) return 'Not specified';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const getAge = (dateString: Date | undefined) => {
		if (!dateString) return '';
		const birthDate = new Date(dateString);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	return (
		<>
			<Head>
				<title>{data.displayname || username} | Sociava</title>
				<meta name="description" content={data.about || 'User profile on Sociava'} />
				<meta property="og:title" content={data.displayname || username} />
				<meta property="og:description" content={data.about || 'User profile on Sociava'} />
				<meta
					property="og:image"
					content={data.banner || data.avatar || 'http://purrquinox.com/banner.png'}
				/>
				<meta
					property="og:url"
					content={typeof window !== 'undefined' ? window.location.href : undefined}
				/>
				<meta name="twitter:card" content="summary_large_image" />
			</Head>

			{/* Profile */}
			<Tooltip.Provider>
				<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
					{/* Hero Banner Section */}
					<div className="relative h-96 overflow-hidden">
						<img
							src={data.banner || '/placeholder.svg'}
							alt="Profile banner"
							className="h-full w-full object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

						{/* Animated background overlay */}
						<div className="absolute inset-0 opacity-20">
							<svg className="h-full w-full" viewBox="0 0 1000 400">
								<defs>
									<pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
										<path
											d="M 60 0 L 0 0 0 60"
											fill="none"
											stroke="rgba(255,255,255,0.1)"
											strokeWidth="1"
										/>
										<circle cx="30" cy="30" r="1" fill="rgba(255,255,255,0.2)" />
									</pattern>
								</defs>
								<rect width="100%" height="100%" fill="url(#heroGrid)" />
							</svg>
						</div>

						{/* Profile Stats Overlay */}
						<div className="absolute right-8 top-8 flex gap-4">
							<div className="rounded-2xl border border-white/20 bg-black/30 px-4 py-3 backdrop-blur-md">
								<div className="flex items-center gap-2 text-white">
									<Heart className="h-5 w-5 fill-red-400 text-red-400" />
									<div>
										<div className="text-lg font-bold">{likes}</div>
										<div className="text-xs text-gray-300">Likes</div>
									</div>
								</div>
							</div>
							<div className="rounded-2xl border border-white/20 bg-black/30 px-4 py-3 backdrop-blur-md">
								<div className="flex items-center gap-2 text-white">
									<Eye className="h-5 w-5 text-blue-400" />
									<div>
										<div className="text-lg font-bold">{data.views}</div>
										<div className="text-xs text-gray-300">Views</div>
									</div>
								</div>
							</div>
							{/*
							<div className="rounded-2xl border border-white/20 bg-black/30 px-4 py-3 backdrop-blur-md">
								<div className="flex items-center gap-2 text-white">
									<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
									<div>
										<div className="text-lg font-bold">4.9</div>
										<div className="text-xs text-gray-300">Rating</div>
									</div>
								</div>
							</div>*/}
						</div>
					</div>

					{/* Main Profile Section */}
					<div className="relative z-10 -mt-32">
						<div className="mx-auto max-w-7xl px-8">
							{/* Profile Header */}
							<div className="mb-12 flex flex-col gap-8 lg:flex-row">
								{/* Avatar and Basic Info */}
								<div className="flex flex-col items-center lg:items-start">
									<div className="relative mb-6">
										<Avatar className="h-32 w-32 border-4 border-white shadow-lg">
											<AvatarImage
												src={data.avatar}
												alt="Profile picture"
												className="object-cover"
											/>
										</Avatar>

										{/* Status Badges */}
										<div className="absolute -bottom-4 -right-4 flex gap-2">
											{data.isVerified && (
												<Tooltip.Root>
													<Tooltip.Trigger asChild>
														<div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-blue-500 shadow-lg">
															<Shield className="h-6 w-6 fill-white text-white" />
														</div>
													</Tooltip.Trigger>
													<Tooltip.Portal>
														<Tooltip.Content className="rounded-lg bg-black px-3 py-2 text-sm text-white">
															Verified Account
														</Tooltip.Content>
													</Tooltip.Portal>
												</Tooltip.Root>
											)}

											{data.staff && (
												<Tooltip.Root>
													<Tooltip.Trigger asChild>
														<div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
															<Crown className="h-6 w-6 text-white" />
														</div>
													</Tooltip.Trigger>
													<Tooltip.Portal>
														<Tooltip.Content className="rounded-lg bg-black px-3 py-2 text-sm text-white">
															Staff Member
														</Tooltip.Content>
													</Tooltip.Portal>
												</Tooltip.Root>
											)}

											{data.isDeveloper && (
												<Tooltip.Root>
													<Tooltip.Trigger asChild>
														<div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-green-500 shadow-lg">
															<Code className="h-6 w-6 text-white" />
														</div>
													</Tooltip.Trigger>
													<Tooltip.Portal>
														<Tooltip.Content className="rounded-lg bg-black px-3 py-2 text-sm text-white">
															Developer
														</Tooltip.Content>
													</Tooltip.Portal>
												</Tooltip.Root>
											)}
										</div>
									</div>

									{/* Quick Actions */}
									<div className="flex gap-3">
										<button
											onClick={() => likeMutation.mutate(liked ? 'unlike' : 'like')}
											className="flex items-center rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-600 hover:to-blue-600"
										>
											<Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
											{liked ? 'Liked' : 'Like'}
										</button>
										<button className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20">
											Message
										</button>
									</div>
								</div>

								{/* Profile Details */}
								<div className="flex-1 space-y-6">
									<div>
										<div className="mb-3 flex items-center gap-4">
											<h1 className="text-5xl font-bold text-white">
												{data.displayname || data.Username}
											</h1>
											<span className="text-2xl text-purple-300">@{data.Username}</span>
										</div>
										<p className="mb-6 text-xl leading-relaxed text-gray-300">{data.about}</p>

										{/* Meta Information */}
										<div className="grid grid-cols-2 gap-4 text-gray-400 lg:grid-cols-4">
											<div className="flex items-center gap-2">
												<Calendar className="h-5 w-5 text-blue-400" />
												<span>{getAge(data.birthday)} years old</span>
											</div>
											<div className="flex items-center gap-2">
												<Users className="h-5 w-5 text-green-400" />
												<span>{data.pronouns}</span>
											</div>
											<div className="flex items-center gap-2">
												<Globe className="h-5 w-5 text-cyan-400" />
												<a href={data.website} className="transition-colors hover:text-cyan-300">
													Website
												</a>
											</div>
											<div className="flex items-center gap-2">
												<span className="h-3 w-3 animate-pulse rounded-full bg-green-400"></span>
												<span>Online</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Content Grid */}
							<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
								{/* Left Column - Roles & Expertise */}
								<div className="space-y-8 lg:col-span-2">
									{/* Roles Section */}
									<section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
										<h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-white">
											<Briefcase className="h-6 w-6 text-purple-400" />
											Professional Roles
										</h2>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											{data.roles.map((role, index) => (
												<div
													key={index}
													className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4"
												>
													<div className="text-lg font-semibold text-purple-200">{role}</div>
												</div>
											))}
										</div>
									</section>

									{/* Expertise Section */}
									<section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
										<h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-white">
											<Zap className="h-6 w-6 text-yellow-400" />
											Technical Expertise
										</h2>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											{data.occupation.map((job, index) => (
												<div
													key={index}
													className="rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4"
												>
													<div className="text-lg font-semibold text-yellow-200">{job}</div>
													<div className="text-sm text-gray-400">Professional Experience</div>
												</div>
											))}
										</div>
									</section>
								</div>

								{/* Right Column - Additional Info */}
								<div className="space-y-8">
									{/* Languages */}
									<section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
										<h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
											<Languages className="h-5 w-5 text-blue-400" />
											Languages
										</h3>
										<div className="space-y-2">
											{data.language.split(', ').map((lang, index) => (
												<div key={index} className="flex items-center justify-between">
													<span className="text-gray-300">{lang}</span>
													<div className="h-2 w-16 overflow-hidden rounded-full bg-gray-700">
														<div
															className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
															style={{ width: '90%' }}
														></div>
													</div>
												</div>
											))}
										</div>
									</section>

									{/* Skills */}
									<section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
										<h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
											<Code className="h-5 w-5 text-green-400" />
											Skills & Technologies
										</h3>
										<div className="space-y-3">
											{data.skills.map((skill, index) => (
												<div
													key={index}
													className="rounded-xl border border-green-500/30 bg-green-500/20 p-3"
												>
													<div className="font-medium text-green-200">{skill}</div>
													<div className="mt-1 text-xs text-gray-400">Expert Level</div>
												</div>
											))}
										</div>
									</section>

									{/* Contact */}
									<section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
										<h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
											<Globe className="h-5 w-5 text-cyan-400" />
											Connect
										</h3>
										<div className="space-y-3">
											<a
												href={data.website}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/20 p-3 transition-colors hover:bg-cyan-500/30"
											>
												<Globe className="h-4 w-4 text-cyan-300" />
												<span className="text-cyan-200">Personal Website</span>
												<ExternalLink className="ml-auto h-4 w-4 text-cyan-300" />
											</a>
										</div>
									</section>
								</div>
							</div>
						</div>
					</div>

					{/* Footer Space */}
					<div className="h-20"></div>
				</div>
			</Tooltip.Provider>
		</>
	);
}
