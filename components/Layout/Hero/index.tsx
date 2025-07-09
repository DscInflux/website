'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import UserCarousel from '@/components/ui/global/Carousel';
import { useRouter } from 'next/navigation';
import Thing from '@/components/Layout/Hero/thing';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Entity } from '@/types/entity';

const Index = () => {
	const router = useRouter();
	const [isSignInDrawerOpen, setIsSignInDrawerOpen] = useState(false);
	const { data: session } = useSession();
	const user = session?.user;

	// --- React Query: Fetch users for carousels ---
	const { data: popularUsers = [], isLoading: popularLoading } = useQuery({
		queryKey: ['hero-popular-users'],
		queryFn: async () => {
			const res = await fetch('/api/get/entity/all?sort=popular&limit=10');
			const data = await res.json();
			return data?.data || [];
		}
	});

	const { data: newestUsers = [], isLoading: newestLoading } = useQuery({
		queryKey: ['hero-newest-users'],
		queryFn: async () => {
			const res = await fetch('/api/get/entity/all?sort=newest&limit=10');
			const data = await res.json();
			return data?.data || [];
		}
	});

	const { data: randomUsers = [], isLoading: randomLoading } = useQuery({
		queryKey: ['hero-random-users'],
		queryFn: async () => {
			const res = await fetch('/api/get/entity/all?sort=random&limit=10');
			const data = await res.json();
			return data?.data || [];
		}
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const username = (e.currentTarget.username as HTMLInputElement).value.trim();
		if (username) {
			router.push(`/explore?name=${encodeURIComponent(username)}`);
		}
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8 }}
				className="relative z-10 min-h-screen"
			>
				<Hero onSubmit={handleSubmit} />

				<div className="relative">
					{/* Background decoration */}
					<div className="absolute inset-0 overflow-hidden">
						<div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 transform rounded-full bg-white/5 blur-3xl" />
						<div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gray-800/20 blur-2xl" />
					</div>

					<div className="relative z-10">
						<UserCarousel
							title="Popular Users"
							users={popularUsers.map((entity: Entity) => ({
								entity,
								isLiked: user ? entity.likes?.includes(user.id) : false
							}))}
							isLoading={popularLoading}
						/>

						<UserCarousel
							title="Newest Members"
							users={newestUsers.map((entity: Entity) => ({
								entity,
								isLiked: user ? entity.likes?.includes(user.id) : false
							}))}
							isLoading={newestLoading}
						/>

						<UserCarousel
							title="Discover Random"
							users={randomUsers.map((entity: Entity) => ({
								entity,
								isLiked: user ? entity.likes?.includes(user.id) : false
							}))}
							isLoading={randomLoading}
						/>
					</div>
				</div>
			</motion.div>
		</>
	);
};

export default Index;
