'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Entity } from '@/types/entity';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Code, Crown, ExternalLink, Eye, Heart, Shield } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
		<Tooltip.Provider>
			<div className="w-80 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
				{/* Mini Banner */}
				<div className="relative h-20 overflow-hidden">
					<img
						src={entity.banner || '/placeholder.svg'}
						alt="Profile banner"
						className="h-full w-full object-cover opacity-60"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

					{/* Floating stats */}
					<div className="absolute right-2 top-2 flex gap-1">
						<div className="rounded-full border border-white/20 bg-black/40 px-2 py-1 backdrop-blur-sm">
							<div className="flex items-center gap-1 text-xs text-white">
								<Heart className="h-3 w-3 fill-red-400 text-red-400" />
								<span>{entity.likes.length}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Profile Content */}
				<div className="relative px-4 pb-4">
					{/* Avatar */}
					<div className="absolute -top-8 left-4">
						<div className="relative">
							<Avatar className="border-3 h-16 w-16 overflow-hidden rounded-xl border-white/20 shadow-lg">
								<AvatarImage
									src={entity.avatar}
									alt={entity.displayname}
									className="h-full w-full object-cover"
								/>
								<AvatarFallback className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-lg font-bold text-white">
									{entity.displayname.charAt(0)}
								</AvatarFallback>
							</Avatar>

							{/* Status badges */}
							<div className="absolute -bottom-1 -right-1 flex gap-1">
								{entity.isVerified && (
									<Tooltip.Root>
										<Tooltip.Trigger asChild>
											<div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-sm">
												<Shield className="h-2.5 w-2.5 fill-white text-white" />
											</div>
										</Tooltip.Trigger>
										<Tooltip.Portal>
											<Tooltip.Content className="rounded bg-black px-2 py-1 text-xs text-white">
												Verified
											</Tooltip.Content>
										</Tooltip.Portal>
									</Tooltip.Root>
								)}

								{entity.staff && (
									<Tooltip.Root>
										<Tooltip.Trigger asChild>
											<div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-yellow-400 to-orange-500 shadow-sm">
												<Crown className="h-2.5 w-2.5 text-white" />
											</div>
										</Tooltip.Trigger>
										<Tooltip.Portal>
											<Tooltip.Content className="rounded bg-black px-2 py-1 text-xs text-white">
												Staff
											</Tooltip.Content>
										</Tooltip.Portal>
									</Tooltip.Root>
								)}

								{entity.isDeveloper && (
									<Tooltip.Root>
										<Tooltip.Trigger asChild>
											<div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-sm">
												<Code className="h-2.5 w-2.5 text-white" />
											</div>
										</Tooltip.Trigger>
										<Tooltip.Portal>
											<Tooltip.Content className="rounded bg-black px-2 py-1 text-xs text-white">
												Developer
											</Tooltip.Content>
										</Tooltip.Portal>
									</Tooltip.Root>
								)}
							</div>
						</div>
					</div>

					{/* Profile Info */}
					<div className="space-y-3 pt-10">
						<div>
							<div className="mb-1 flex items-center gap-2">
								<h3 className="text-lg font-bold text-white">
									{entity.displayname || entity.Username}
								</h3>
								<span className="text-sm text-purple-300">@{entity.Username}</span>
							</div>
							<p className="line-clamp-2 text-sm text-gray-300">{entity.about}</p>
						</div>

						{/* Quick stats */}
						<div className="flex items-center justify-between text-xs text-gray-400">
							<div className="flex items-center gap-1">
								<span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
								<span>Online</span>
							</div>
							<div className="flex items-center gap-1">
								<Eye className="h-3 w-3" />
								<span>{entity.views?.length ?? 0} views</span>
							</div>
						</div>

						{/* Primary role */}
						{entity.roles.length > 0 && (
							<div className="rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2">
								<div className="text-sm font-medium text-purple-200">{entity.roles[0]}</div>
							</div>
						)}

						{/* Action buttons */}
						<div className="flex gap-2 pt-2">
							<button
								onClick={() => likeMutation.mutate(liked ? 'unlike' : 'like')}
								className="flex items-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-purple-600 hover:to-blue-600"
							>
								<Heart className={`mr-2 h-4 w-4 ${liked ? 'fill-current' : ''}`} />
								{liked ? 'Liked' : 'Like'}
							</button>
							<Link
								href={`/user/${entity.Username}`}
								className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
							>
								<ExternalLink className="h-4 w-4" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</Tooltip.Provider>
	);
};

export default UserCard;
