'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaRegHeart, FaUserShield, FaCode, FaHandshake } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Entity } from '@/types/entity';

type UserCardProps = {
	entity: Entity;
	isSkeleton?: boolean;
	isLiked?: boolean;
};

const UserCard: React.FC<UserCardProps> = ({ entity, isSkeleton = false, isLiked = false }) => {
	const { data: session } = useSession();
	const queryClient = useQueryClient();
	const user = session?.user;

	const [liked, setLiked] = useState(() => {
		if (!user?.id || !entity.likes) return isLiked;
		return entity.likes.includes(user.id);
	});

	useEffect(() => {
		if (user?.id && entity.likes) {
			setLiked(entity.likes.includes(user.id));
		} else {
			setLiked(isLiked);
		}
	}, [entity.likes, user?.id, isLiked]);

	const likeMutation = useMutation({
		mutationFn: async (action: 'like' | 'unlike') => {
			const endpoint = `/api/post/entity/heart?action=${action}&url=${entity.url}`;
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

	const toggleLike = async () => {
		if (!user?.id) return;
		setLiked(!liked);
		const action = liked ? 'unlike' : 'like';
		likeMutation.mutate(action);
	};

	if (isSkeleton) {
		return (
			<div className="h-[250px] w-full animate-pulse overflow-hidden rounded-xl bg-gray-100 p-4 dark:bg-gray-800" />
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
			className="flex h-[250px] w-full select-none flex-col justify-between overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-800 dark:bg-dark"
		>
			{/* Top: avatar + name */}
			<div className="flex items-center gap-4">
				<div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-primary/20">
					<Image
						src={entity.avatar || 'https://purrquinox.com/_next/image?url=%2Flogo.png&w=32&q=75'}
						alt={`${entity.Username} avatar`}
						fill
						sizes="64px"
						style={{ objectFit: 'cover' }}
						onError={(e) => {
							(e.target as HTMLImageElement).src =
								'https://purrquinox.com/_next/image?url=%2Flogo.png&w=32&q=75';
						}}
					/>
				</div>
				<div>
					<h1 className="flex items-center gap-1.5 text-lg font-bold text-black dark:text-white">
						{entity.Username}
						{entity.isVerified && <FaCircleCheck size={18} className="text-primary" />}
						{entity.staff && <FaUserShield className="text-red-500" title="Staff" />}
						{entity.isDeveloper && <FaCode className="text-green-500" title="Developer" />}
						{entity.isPartner && <FaHandshake className="text-yellow-500" title="Partner" />}
					</h1>
					<p className="text-sm font-medium text-gray-500 dark:text-gray-400">@{entity.url}</p>
				</div>
			</div>

			{/* Middle: about text */}
			<p className="mt-4 line-clamp-3 flex-grow overflow-hidden text-sm font-medium text-gray-600 dark:text-gray-300">
				{typeof entity.about === 'string' ? entity.about : JSON.stringify(entity.about)}
			</p>

			{/* Bottom: actions */}
			<div className="mt-4 flex items-center justify-between gap-4">
				<Link
					href={`/user/${entity.url}`}
					className="flex-grow rounded-lg bg-primary/10 px-4 py-2.5 text-center font-medium text-primary transition-all duration-200 hover:bg-primary/20"
				>
					View Profile
				</Link>

				<button
					onClick={toggleLike}
					className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
					aria-pressed={liked}
					aria-label={liked ? 'Unlike' : 'Like'}
					type="button"
				>
					{liked ? (
						<FaHeart className="text-red-500" size={18} />
					) : (
						<FaRegHeart className="text-gray-500 dark:text-gray-400" size={18} />
					)}
				</button>
			</div>
		</motion.div>
	);
};

export default UserCard;
