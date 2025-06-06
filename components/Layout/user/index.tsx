'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
	Heart,
	HeartCrack,
	Edit,
	Briefcase,
	MapPin,
	Cake,
	Users,
	Languages,
	Info,
	Share2,
	Zap,
	Sparkles,
	ExternalLink
} from 'lucide-react';
import { MdVerified } from 'react-icons/md';
import { RiTimeZoneFill } from 'react-icons/ri';
import type { Entity } from '@/types/entity';
import { Code, Handshake, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ImageModal, { useImageModal } from '@/components/ui/ImageModal';
import { SOCIAL_ICON_MAP } from './SocialProvider';

export default function UserProfile({ username }: { username: string }) {
	const { data: session } = useSession();
	const user = session?.user || null;
	const queryClient = useQueryClient();
	const imageModal = useImageModal();

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
			<div className="flex min-h-screen items-center justify-center bg-light dark:bg-dark">
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
			<div className="flex min-h-screen items-center justify-center bg-light dark:bg-dark">
				<div className="mx-auto max-w-md rounded-xl bg-white bg-opacity-50 p-8 text-center shadow-lg backdrop-blur-sm dark:bg-dark dark:bg-opacity-50">
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
		return ` (${age} years)`;
	};

	const cards = [
		{
			upper: true,
			name: 'About Me',
			subtitle: 'Who am I?',
			isPrivate: false,
			isEmpty: !data.about,
			value: data.about,
			icon: <Info className="text-primary" strokeWidth={1.5} />
		},
		{
			upper: false,
			name: 'Occupation',
			subtitle: 'What do I do?',
			isPrivate: false,
			isEmpty: !data.occupation || data.occupation.length === 0,
			value: data.occupation?.join(', '),
			icon: <Briefcase className="text-primary" strokeWidth={1.5} />
		},
		{
			upper: false,
			name: 'Location',
			subtitle: 'Where do I live?',
			isPrivate: data.isLocationPrivate,
			isEmpty: !data.location,
			value: data.location,
			icon: <MapPin className="text-primary" strokeWidth={1.5} />
		},
		{
			upper: false,
			name: 'Birthday',
			subtitle: 'When was I born?',
			isPrivate: data.isBirthdayPrivate,
			isEmpty: !data.birthday,
			value: data.birthday ? `${formatDate(data.birthday)}${getAge(data.birthday)}` : '',
			icon: <Cake className="text-primary" strokeWidth={1.5} />
		},
		{
			upper: false,
			name: 'Gender',
			subtitle: 'What is my gender?',
			isPrivate: data.isGenderPrivate,
			isEmpty: !data.gender,
			value: data.gender,
			icon: <Users className="text-primary" strokeWidth={1.5} />
		},
		{
			upper: false,
			name: 'Pronouns',
			subtitle: 'What are my pronouns?',
			isPrivate: data.isPronounsPrivate,
			isEmpty: !data.gender && !data.pronouns,
			value: data.pronouns,
			icon: <Users className="text-primary" strokeWidth={1.5} />
		},
		{
			upper: false,
			name: 'Native Language',
			subtitle: 'What is my native language?',
			isPrivate: false,
			isEmpty: !data.language,
			value: data.language,
			icon: <Languages className="text-primary" strokeWidth={1.5} />
		},
		{
			upper: false,
			name: 'Sexuality',
			subtitle: 'What is my sexuality?',
			isPrivate: data.isSexualityPrivate,
			isEmpty: !data.sexuality,
			value: data.sexuality,
			icon: <Heart className="text-primary" strokeWidth={1.5} />
		},
		{
			upper: false,
			name: 'Timezone',
			subtitle: 'What is my timezone?',
			isPrivate: false,
			isEmpty: !data.timeZone,
			value: data.timeZone,
			icon: <RiTimeZoneFill className="text-primary" strokeWidth={1.5} />
		},
		{
			upper: false,
			name: 'Website',
			subtitle: 'My personal website?',
			isPrivate: false,
			isEmpty: !data.website,
			value: data.website,
			icon: <ExternalLink className="text-primary" strokeWidth={1.5} />
		},
		{
			upper: false,
			name: 'Height',
			subtitle: 'How tall am I?',
			isPrivate: data.isHeightPrivate,
			isEmpty: !data.height,
			value: data.height ? `${data.height} cm` : undefined,
			icon: <Users className="text-primary" strokeWidth={1.5} />
		}
	];

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
			<div className="3xl:px-0 flex min-h-screen flex-col items-center justify-center px-4 md:px-10">
				{/* Image Modal for avatar/banner */}
				<ImageModal
					isOpen={imageModal.modalState.isOpen}
					onClose={imageModal.closeModal}
					src={imageModal.modalState.src}
					alt={imageModal.modalState.alt}
					type={imageModal.modalState.type}
					username={data.Username || username}
				/>
				<div className="w-full max-w-7xl">
					<div id="user-header" className="relative mb-12">
						{/* Decorative elements */}
						<div className="absolute inset-0 z-0 overflow-hidden rounded-3xl bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent_50%)] opacity-30 dark:opacity-50"></div>
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(67,56,202,0.15),transparent_50%)] opacity-30 dark:opacity-50"></div>
						</div>

						{/* Banner */}
						<div
							className="group relative z-10 h-[400px] w-full cursor-pointer overflow-hidden rounded-3xl shadow-xl"
							onClick={() =>
								imageModal.openModal(
									data.banner || 'http://purrquinox.com/banner.png',
									`${data.Username || username}'s Banner`,
									'banner',
									data.Username || username
								)
							}
							tabIndex={0}
							role="button"
							aria-label="View banner image"
						>
							{data.banner ? (
								<Image
									id="user-banner"
									src={data.banner || 'http://purrquinox.com/banner.png'}
									alt="Banner"
									className="absolute h-full w-full object-cover"
									fill
									priority
									draggable={false}
									// Remove onClick from Image, handled by parent
								/>
							) : (
								<div className="absolute h-full w-full bg-gradient-to-r from-primary to-secondary opacity-50" />
							)}
							{/* Overlay gradient */}
							<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
						</div>

						{/* User info section */}
						<div
							id="user-info"
							className="relative z-20 flex flex-col items-center gap-6 pr-0 lg:flex-row lg:pl-16"
						>
							{/* Avatar */}
							<div className="relative -mt-20 h-40 w-40 flex-shrink-0 overflow-hidden rounded-full shadow-2xl ring-8 ring-light dark:ring-dark">
								{data.avatar ? (
									<Image
										src={
											data.avatar || 'https://purrquinox.com/_next/image?url=%2Flogo.png&w=32&q=75'
										}
										alt="Avatar"
										id="user-avatar"
										className="h-full w-full cursor-pointer object-cover"
										width={160}
										height={160}
										onClick={() =>
											imageModal.openModal(
												data.avatar,
												`${data.Username || username}'s Avatar`,
												'avatar',
												data.Username || username
											)
										}
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/80 to-secondary">
										<span className="text-5xl font-bold text-white">
											{data.Username?.charAt(0).toUpperCase() || 'U'}
										</span>
									</div>
								)}
							</div>

							<div className="mt-4 flex w-full flex-col items-center justify-center lg:mt-0 lg:flex-row lg:justify-between">
								<div className="mb-6 flex w-full items-center justify-center gap-4 text-center lg:mb-0 lg:justify-start lg:text-left">
									<div className="flex flex-col">
										<div className="flex items-center gap-2">
											<h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-primary/80">
												{data.Username}
											</h1>
											<div className="flex items-center gap-2">
												{data.isVerified && (
													<div className="group relative">
														<MdVerified className="text-2xl text-primary" />
														<div className="absolute -top-10 left-1/2 z-50 -translate-x-1/2 transform whitespace-nowrap rounded bg-white px-2 py-1 text-black opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-dark dark:text-white">
															Verified Profile
														</div>
													</div>
												)}
												{data.staff && (
													<div className="group relative">
														<Shield className="text-2xl text-red-500" />
														<div className="absolute -top-10 left-1/2 z-50 -translate-x-1/2 transform whitespace-nowrap rounded bg-white px-2 py-1 text-black opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-dark dark:text-white">
															Staff
														</div>
													</div>
												)}
												{data.isDeveloper && (
													<div className="group relative">
														<Code className="text-2xl text-green-500" />
														<div className="absolute -top-10 left-1/2 z-50 -translate-x-1/2 transform whitespace-nowrap rounded bg-white px-2 py-1 text-black opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-dark dark:text-white">
															Developer
														</div>
													</div>
												)}
												{data.isPartner && (
													<div className="group relative">
														<Handshake className="text-2xl text-yellow-500" />
														<div className="absolute -top-10 left-1/2 z-50 -translate-x-1/2 transform whitespace-nowrap rounded bg-white px-2 py-1 text-black opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:bg-dark dark:text-white">
															Partner
														</div>
													</div>
												)}
											</div>
										</div>
										{data.displayname && (
											<span className="text-xl font-medium text-zinc-500 dark:text-zinc-400">
												{data.displayname}
											</span>
										)}
									</div>
								</div>
								<div className="flex w-full items-center justify-center gap-4 lg:w-2/4 lg:justify-end">
									<div className="group relative">
										<button
											className={`flex items-center gap-2 rounded-full px-6 py-2.5 transition-all duration-300 ${
												liked
													? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/20'
													: 'dark:bg-dark/80 border border-red-500 bg-white text-red-500 hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/10 dark:hover:bg-red-900/20'
											}`}
											onClick={toggleLike}
											disabled={likeMutation.isPending}
										>
											{liked ? <Heart className="h-5 w-5" /> : <HeartCrack className="h-5 w-5" />}
											<span className="font-medium">{likes}</span>
										</button>
									</div>
									{data.isSelf && (
										<Link href={`/${data.url}/edit`}>
											<button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
												<Edit className="h-5 w-5" />
												<span className="font-medium">Edit Profile</span>
											</button>
										</Link>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* About section */}
					<AnimatePresence>
						{cards
							.filter((el) => el.upper)
							.map((card, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4, delay: i * 0.1 }}
									className="mb-8 w-full rounded-2xl border border-gray-100 bg-opacity-80 p-6 px-8 shadow-xl backdrop-blur-sm dark:border-gray-800 dark:bg-opacity-80 dark:shadow-2xl"
								>
									<div className="mb-4 flex items-center gap-4">
										<div className="flex-shrink-0 rounded-xl bg-primary/10 p-3 dark:bg-primary/20">
											{card.icon}
										</div>
										<div className="flex flex-col justify-center">
											<h1 className="text-xl font-semibold">{card.name}</h1>
											<p className="text-sm text-gray-500 dark:text-gray-400">{card.subtitle}</p>
										</div>
									</div>
									{card.isPrivate ? (
										<p className="text-md italic text-gray-500 dark:text-gray-400">
											This information is private.
										</p>
									) : card.isEmpty ? (
										<p className="text-md italic text-gray-500 dark:text-gray-400">
											This information is not set. wow
										</p>
									) : (
										<p className="text-md whitespace-pre-line leading-relaxed">{card.value}</p>
									)}
								</motion.div>
							))}
					</AnimatePresence>

					{/* Info cards grid */}
					<div className="mt-4 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						<AnimatePresence>
							{cards
								.filter((el) => !el.upper)
								.map((card, i) => (
									<motion.div
										key={i}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, delay: i * 0.1 }}
										className="rounded-2xl border border-gray-100 bg-opacity-80 p-6 px-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/10 hover:shadow-xl dark:border-gray-800 dark:bg-opacity-80 dark:shadow-xl"
									>
										<div className="mb-4 flex items-center gap-4">
											<div className="flex-shrink-0 rounded-xl bg-primary/10 p-3 dark:bg-primary/20">
												{card.icon}
											</div>
											<div className="flex flex-col justify-center">
												<h1 className="text-xl font-semibold">{card.name}</h1>
												<p className="text-sm text-gray-500 dark:text-gray-400">{card.subtitle}</p>
											</div>
										</div>
										{card.isPrivate ? (
											<p className="text-md italic text-gray-500 dark:text-gray-400">
												This information is private.
											</p>
										) : card.isEmpty ? (
											<p className="text-md italic text-gray-500 dark:text-gray-400">
												This information is not set. damn
											</p>
										) : card.name === 'Website' ? (
											card.value ? (
												<a
													href={
														card.value.startsWith('http') ? card.value : `https://${card.value}`
													}
													target="_blank"
													rel="noopener noreferrer"
													className="break-all text-primary underline transition-colors duration-200 hover:text-secondary"
												>
													{card.value}
												</a>
											) : null
										) : (
											<p className="text-md text-gray-500 dark:text-gray-400">{card.value}</p>
										)}
									</motion.div>
								))}
						</AnimatePresence>
					</div>

					{/* Roles and Skills section */}
					<div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.6 }}
							className="rounded-2xl border border-gray-100 bg-opacity-80 p-6 px-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/10 hover:shadow-xl dark:border-gray-800 dark:bg-opacity-80 dark:shadow-xl"
						>
							<div className="mb-6 flex items-center gap-4">
								<div className="flex-shrink-0 rounded-xl bg-primary/10 p-3 dark:bg-primary/20">
									<Sparkles className="text-primary" strokeWidth={1.5} />
								</div>
								<div className="flex flex-col justify-center">
									<h1 className="text-xl font-semibold">My Roles</h1>
									<p className="text-sm text-gray-500 dark:text-gray-400">Roles that I have.</p>
								</div>
							</div>
							{!data.roles || data.roles.length === 0 ? (
								<p className="text-md italic text-gray-500 dark:text-gray-400">
									idk i didnt set this just take a guess.
								</p>
							) : (
								<div className="flex flex-wrap gap-2">
									{data.roles.map((role, i) => (
										<div
											key={i}
											className="flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20"
										>
											{role}
										</div>
									))}
								</div>
							)}
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.7 }}
							className="rounded-2xl border border-gray-100 bg-opacity-80 p-6 px-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/10 hover:shadow-xl dark:border-gray-800 dark:bg-opacity-80 dark:shadow-xl"
						>
							<div className="mb-6 flex items-center gap-4">
								<div className="flex-shrink-0 rounded-xl bg-primary/10 p-3 dark:bg-primary/20">
									<Zap className="text-primary" strokeWidth={1.5} />
								</div>
								<div className="flex flex-col justify-center">
									<h1 className="text-xl font-semibold">My Skills</h1>
									<p className="text-sm text-gray-500 dark:text-gray-400">What I know?</p>
								</div>
							</div>
							{!data.skills || data.skills.length === 0 ? (
								<p className="text-md italic text-gray-500 dark:text-gray-400">
									This information is not set. idk too man
								</p>
							) : (
								<div className="flex flex-wrap gap-2">
									{data.skills.map((skill, i) => (
										<div
											key={i}
											className="flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20"
										>
											{skill}
										</div>
									))}
								</div>
							)}
						</motion.div>
					</div>

					{/* Socials section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.8 }}
						className="mb-12 mt-6 grid w-full grid-cols-1 gap-6"
					>
						<div className="rounded-2xl border border-gray-100 bg-opacity-80 p-6 px-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/10 hover:shadow-xl dark:border-gray-800 dark:bg-opacity-80 dark:shadow-xl">
							<div className="mb-6 flex items-center gap-4">
								<div className="flex-shrink-0 rounded-xl p-3">
									<Share2 className="text-primary" strokeWidth={1.5} />
								</div>
								<div className="flex flex-col justify-center">
									<h1 className="text-xl font-semibold">My Socials</h1>
									<p className="text-sm text-gray-500 dark:text-gray-400">Links to my socials.</p>
								</div>
							</div>
							{!data.socials || data.socials.length === 0 ? (
								<p className="text-md italic text-gray-500 dark:text-gray-400">
									This information is not set. Why you may ask? idk
								</p>
							) : (
								<div className="grid grid-cols-1 gap-4 text-white md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
									{data.socials.map((social, i) => (
										<a
											href={social.url + '?utm_source=sociava.xyz'}
											target="_blank"
											rel="noopener noreferrer"
											key={i}
											className="group relative flex cursor-pointer items-center justify-between gap-2 rounded-full rounded-xl border border-gray-100 border-primary/10 bg-primary/5 px-4 px-6 py-2 py-4 text-sm font-medium text-white transition-all transition-colors duration-200 hover:border-primary/20 hover:bg-primary/10 hover:shadow-lg active:border-primary/50 dark:border-gray-800 dark:bg-primary/10 dark:hover:bg-primary/20"
											style={{ color: social.color || 'currentColor' }}
										>
											{/* Social Icon */}
											{SOCIAL_ICON_MAP[social.name] && (
												<span className="mr-2 flex-shrink-0">{SOCIAL_ICON_MAP[social.name]}</span>
											)}
											<h1 className="text-md select-none font-medium capitalize text-white">
												{social.name}
											</h1>
											<ExternalLink className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-white" />
										</a>
									))}
								</div>
							)}
						</div>
					</motion.div>
				</div>
			</div>
		</>
	);
}
