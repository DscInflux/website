'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
	FiMessageCircle,
	FiMapPin,
	FiGlobe,
	FiStar,
	FiShield,
	FiMoreHorizontal,
	FiHeart,
	FiShare2,
	FiEye
} from 'react-icons/fi';
import { Entity } from '@/types/entity';

interface UserCardProps {
	user: Entity;
	className?: string;
	compact?: boolean;
	isSkeleton?: boolean;
	isLiked?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
	user,
	className = '',
	compact = false,
	isSkeleton = false,
	isLiked = false
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [imageError, setImageError] = useState(false);
	const router = useRouter();
	const { data: session } = useSession();
	const queryClient = useQueryClient();
	const sessionUser = session?.user;

	const [liked, setLiked] = useState(() => {
		if (!sessionUser?.id || !user.likes) return isLiked;
		return user.likes.includes(sessionUser.id);
	});

	useEffect(() => {
		if (sessionUser?.id && user.likes) {
			setLiked(user.likes.includes(sessionUser.id));
		} else {
			setLiked(isLiked);
		}
	}, [user.likes, sessionUser?.id, isLiked]);

	const likeMutation = useMutation({
		mutationFn: async (action: 'like' | 'unlike') => {
			const endpoint = `/api/post/entity/heart?action=${action}&url=${user.url}`;
			const res = await fetch(endpoint, { method: 'POST' });
			if (!res.ok) throw new Error(`Failed to ${action}`);
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['hero-popular-users'] });
			queryClient.invalidateQueries({ queryKey: ['hero-newest-users'] });
			queryClient.invalidateQueries({ queryKey: ['hero-random-users'] });
		},
		onError: (error) => {
			console.error('Like/Unlike error:', error);
			setLiked(!liked);
		}
	});

	const handleImageError = () => setImageError(true);
	const toggleExpanded = () => setIsExpanded(!isExpanded);
	const goToProfile = () => router.push(`/user/${user.url}`);

	const toggleLike = async () => {
		if (!sessionUser?.id) return;
		setLiked(!liked);
		const action = liked ? 'unlike' : 'like';
		likeMutation.mutate(action);
	};

	if (isSkeleton) {
		return (
			<div
				className={`h-[400px] w-full animate-pulse overflow-hidden rounded-2xl bg-gray-800 md:rounded-3xl ${compact ? 'h-[300px]' : 'h-[400px]'} ${className}`}
			/>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -4 }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className={`group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black shadow-lg transition-all duration-300 hover:border-gray-600 md:rounded-3xl md:shadow-2xl ${compact ? 'p-3 md:p-4' : 'p-4 md:p-6'} ${className}`}
		>
			{/* Banner */}
			<div
				className={`relative ${compact ? 'h-20 md:h-24' : 'h-24 md:h-32'} -m-4 mb-4 overflow-hidden rounded-lg md:-m-6 md:mb-6 md:rounded-xl`}
			>
				<img
					src={user.banner}
					alt="Profile banner"
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					onError={handleImageError}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

				{/* Like count and views */}
				<div className="absolute left-2 top-2 flex gap-1 md:left-4 md:top-4 md:gap-2">
					<div className="rounded-full border border-white/20 bg-black/40 px-2 py-1 backdrop-blur-sm">
						<div className="flex items-center gap-1 text-xs text-white">
							<FiHeart
								className={`h-3 w-3 ${liked ? 'fill-red-400 text-red-400' : 'text-white'}`}
							/>
							<span>{user.likes?.length || 0}</span>
						</div>
					</div>
					<div className="rounded-full border border-white/20 bg-black/40 px-2 py-1 backdrop-blur-sm">
						<div className="flex items-center gap-1 text-xs text-white">
							<FiEye className="h-3 w-3" />
							<span>{user.views || 0}</span>
						</div>
					</div>
				</div>

				{/* Status indicators with expanding left tooltip */}
				<div className="absolute right-2 top-2 flex space-x-1 md:right-4 md:top-4 md:space-x-2">
					{user.isVerified && (
						<div className="group/status relative">
							<motion.div
								whileTap={{ scale: 0.9 }}
								className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 shadow-lg md:h-6 md:w-6"
								title="Verified"
							>
								<FiShield className="h-2.5 w-2.5 text-white md:h-3 md:w-3" />
							</motion.div>
							<div className="absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg group-hover/status:flex">
								<FiShield className="h-3 w-3 text-blue-400" />
								<span>Verified</span>
							</div>
						</div>
					)}
					{user.staff && (
						<div className="group/status relative">
							<motion.div
								whileTap={{ scale: 0.9 }}
								className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 shadow-lg md:h-6 md:w-6"
								title="Staff"
							>
								<FiStar className="h-2.5 w-2.5 text-white md:h-3 md:w-3" />
							</motion.div>
							<div className="absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg group-hover/status:flex">
								<FiStar className="h-3 w-3 text-purple-400" />
								<span>Staff</span>
							</div>
						</div>
					)}
					{user.isDeveloper && (
						<div className="group/status relative">
							<motion.div
								whileTap={{ scale: 0.9 }}
								className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow-lg md:h-6 md:w-6"
								title="Developer"
							>
								<FiStar className="h-2.5 w-2.5 text-white md:h-3 md:w-3" />
							</motion.div>
							<div className="absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg group-hover/status:flex">
								<FiStar className="h-3 w-3 text-green-400" />
								<span>Developer</span>
							</div>
						</div>
					)}
				</div>

				{/* Action menu (mobile) */}
				<div className="absolute bottom-2 right-2 md:hidden">
					<motion.button
						whileTap={{ scale: 0.9 }}
						className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm"
						onClick={toggleExpanded}
					>
						<FiMoreHorizontal className="h-4 w-4 text-white" />
					</motion.button>
				</div>
			</div>

			{/* Content */}
			<div className="relative">
				{/* Avatar */}
				<div className="relative -mt-8 mb-3 flex justify-center md:-mt-10 md:mb-4">
					<motion.div whileTap={{ scale: 0.95 }} className="relative">
						<div className="border-3 h-12 w-12 overflow-hidden rounded-full border-black bg-gray-700 shadow-xl md:h-16 md:w-16 md:border-4">
							<img
								src={user.avatar}
								alt={user.displayname || user.Username}
								className="h-full w-full object-cover"
								onError={handleImageError}
							/>
						</div>
						{user.presence !== undefined && (
							<div
								className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black shadow-sm md:h-4 md:w-4 ${user.presence === 0 ? 'bg-green-500' : 'bg-gray-500'}`}
							/>
						)}
					</motion.div>
				</div>

				{/* Name + Username */}
				<div className="mb-3 text-center md:mb-4">
					<h3 className="mb-1 line-clamp-1 text-lg font-bold text-white md:text-xl">
						{user.displayname || user.Username}
					</h3>
					<p className="text-sm text-gray-400">@{user.Username}</p>
				</div>

				{/* About */}
				<div className="mb-3 md:mb-4">
					<p
						className={`text-sm leading-relaxed text-gray-300 ${compact || (!isExpanded && typeof window !== 'undefined' && window.innerWidth < 768) ? 'line-clamp-2' : 'line-clamp-3'}`}
					>
						{user.about}
					</p>
					{user.about && user.about.length > 100 && (
						<button
							onClick={toggleExpanded}
							className="mt-1 text-xs text-gray-400 transition-colors hover:text-white md:hidden"
						>
							{isExpanded ? 'Show less' : 'Show more'}
						</button>
					)}
				</div>

				{/* Details */}
				<AnimatePresence>
					<motion.div
						initial={false}
						animate={{ height: 'auto' }}
						className="mb-3 space-y-1.5 md:mb-4 md:space-y-2"
					>
						{user.occupation?.length > 0 && (
							<div className="flex items-center text-xs text-gray-400">
								<div className="mr-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-500" />
								<span className="truncate">{user.occupation[0]}</span>
							</div>
						)}
						{user.location && (
							<div className="flex items-center text-xs text-gray-400">
								<FiMapPin className="mr-2 h-3 w-3 flex-shrink-0" />
								<span className="truncate">{user.location}</span>
							</div>
						)}
						{user.website && (
							<div className="flex items-center text-xs text-gray-400">
								<FiGlobe className="mr-2 h-3 w-3 flex-shrink-0" />
								<span className="truncate">Website</span>
							</div>
						)}
					</motion.div>
				</AnimatePresence>

				{/* Roles */}
				{user.roles?.length > 0 && (
					<div className="mb-4 md:mb-6">
						<div className="flex flex-wrap gap-1.5 md:gap-2">
							{user.roles.slice(0, compact ? 1 : 2).map((role, i) => (
								<span
									key={i}
									className="max-w-24 truncate rounded-full border border-gray-700/50 bg-gray-800/80 px-2 py-1 text-xs text-gray-300 backdrop-blur-sm md:max-w-none md:px-3"
									title={role}
								>
									{role}
								</span>
							))}
							{user.roles.length > (compact ? 1 : 2) && (
								<span className="rounded-full border border-gray-700/50 bg-gray-800/80 px-2 py-1 text-xs text-gray-400 md:px-3">
									+{user.roles.length - (compact ? 1 : 2)}
								</span>
							)}
						</div>
					</div>
				)}

				{/* Mobile Buttons */}
				<div className="mb-4 flex space-x-2 md:hidden">
					<motion.button
						whileTap={{ scale: 0.95 }}
						className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-white py-2.5 text-sm font-medium text-black shadow-lg"
						onClick={goToProfile}
					>
						<FiMessageCircle className="h-4 w-4" />
						<span>Connect</span>
					</motion.button>
					<motion.button
						whileTap={{ scale: 0.95 }}
						className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
							liked ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
						}`}
						onClick={toggleLike}
						disabled={likeMutation.isPending}
					>
						<FiHeart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
					</motion.button>
					<motion.button
						whileTap={{ scale: 0.95 }}
						className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700"
					>
						<FiShare2 className="h-4 w-4" />
					</motion.button>
				</div>

				{/* Desktop Button */}
				<div className="hidden md:flex md:space-x-2">
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-white/10 py-3 font-medium text-gray-300 backdrop-blur-sm transition-all duration-300 hover:text-black group-hover:bg-white group-hover:text-black"
						onClick={goToProfile}
					>
						<FiMessageCircle className="h-4 w-4" />
						<span>Connect</span>
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className={`flex items-center justify-center space-x-2 rounded-xl px-4 py-3 font-medium transition-all duration-300 ${
							liked
								? 'bg-red-500 text-white hover:bg-red-600'
								: 'bg-white/10 text-gray-300 backdrop-blur-sm hover:bg-white/20'
						}`}
						onClick={toggleLike}
						disabled={likeMutation.isPending}
					>
						<FiHeart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
						<span>{liked ? 'Liked' : 'Like'}</span>
					</motion.button>
				</div>
			</div>

			{/* Overlay */}
			<div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:rounded-3xl" />
		</motion.div>
	);
};

export default UserCard;
