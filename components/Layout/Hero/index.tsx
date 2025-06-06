'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Carousel from '@/components/ui/global/Carousel';
import CarouselHeader from '@/components/ui/global/Carousel-Header';
import UserCard from '@/components/cards/UserCards';
import { FaFire, FaDice, FaArrowRight, FaDiscord, FaSearch } from 'react-icons/fa';
import type { Entity } from '@/types/entity';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const HeroLayout = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const [search, setSearch] = useState('');

	const user = session?.user || null;

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

	const Spinner = () => (
		<div className="flex justify-center py-10">
			<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
		</div>
	);

	return (
		<div className="3xl:px-0 font-jakarta relative z-10 px-6">
			<div className="background-shapes absolute inset-0"></div>

			<div className="mx-auto max-w-7xl">
				{/* Hero Section */}
				<section className="flex flex-col items-center justify-between gap-12 py-24 lg:flex-row">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="w-full text-center lg:max-w-2xl lg:text-left"
					>
						<div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
							Find people the right way.
						</div>
						<h1 className="relative text-5xl font-extrabold leading-tight tracking-tight text-black md:text-6xl dark:text-white">
							Start{' '}
							<span className="relative text-primary">
								Finding{' '}
								<span className="absolute -bottom-2 left-0 h-2 w-full rounded-full bg-primary/20"></span>
							</span>{' '}
							Friends
						</h1>
						<p className="mt-6 max-w-xl text-lg font-medium text-gray-600 dark:text-gray-300">
							Find & add new friends on Discord the easy way. Connect with people who share your
							interests.
						</p>

						<motion.form
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.4 }}
							onSubmit={handleSubmit}
							className="mt-8 w-full max-w-xl"
						>
							<div className="flex flex-col items-center gap-4 sm:flex-row">
								<div className="relative w-full flex-grow">
									<div className="absolute left-4 top-1/2 -translate-y-1/2 transform text-gray-400">
										<FaSearch />
									</div>
									<input
										type="text"
										name="username"
										placeholder="Enter Discord username"
										required
										className="h-[56px] w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-black shadow-sm outline-none transition-all focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
									/>
								</div>
								<button
									type="submit"
									className="flex h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 sm:w-auto"
								>
									<FaSearch className="text-lg" />
									Find
								</button>
							</div>
						</motion.form>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6 }}
						className="perspective-right hidden w-full max-w-md lg:block"
					>
						<div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-primary/10 to-primary/5 shadow-xl dark:border-gray-800">
							<div className="absolute bottom-6 left-6 right-6 top-6">
								<div className="absolute left-0 top-0 h-16 w-16 rounded-full bg-primary/20"></div>
								<div className="absolute bottom-12 right-4 h-24 w-24 rounded-full bg-primary/10"></div>
								<div className="absolute right-8 top-1/3 h-8 w-8 rounded-full bg-primary/30"></div>

								<div className="absolute right-10 top-10 h-32 w-32 overflow-hidden rounded-xl border-4 border-white shadow-lg dark:border-gray-800">
									<Image
										src="https://purrquinox.com/_next/image?url=%2Flogo.png&w=32&q=75"
										alt="Discord user"
										width={128}
										height={128}
										className="object-cover"
									/>
								</div>

								<div className="absolute bottom-10 left-10 h-32 w-64 rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
											<FaDiscord />
										</div>
										<div>
											<div className="font-bold text-black dark:text-white">DiscordUser</div>
											<div className="text-xs text-gray-500">@username</div>
										</div>
									</div>
									<div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
										Connect with friends who share your interests in gaming, art, music and more!
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</section>

				{/* Popular Users */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="mt-20"
				>
					<Carousel
						header={(next, prev, isPrev, isNext) => (
							<CarouselHeader
								title="Popular Users"
								icon={<FaFire />}
								seeAll="/explore?sort=likes"
								description="The most popular profiles on Sociava"
								next={next}
								prev={prev}
								isPrev={isPrev}
								isNext={isNext}
							/>
						)}
						slides={popularUsers}
					>
						{(slides: Entity[]) =>
							popularLoading ? (
								<Spinner />
							) : slides.length > 0 ? (
								slides.map((entity) => (
									<UserCard
										key={entity.id}
										entity={entity}
										isLiked={user ? entity.likes?.includes(user.id) : false}
									/>
								))
							) : (
								<div className="col-span-3 py-10 text-center text-gray-500">No users found.</div>
							)
						}
					</Carousel>
				</motion.section>

				{/* Newest Users */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.5 }}
					className="mt-16"
				>
					<Carousel
						header={(next, prev, isPrev, isNext) => (
							<CarouselHeader
								title="Newest Users"
								icon={<FaDice />}
								seeAll="/explore?sort=newest"
								description="Some newest profiles on Sociava"
								next={next}
								prev={prev}
								isPrev={isPrev}
								isNext={isNext}
							/>
						)}
						slides={newestUsers}
					>
						{(slides: Entity[]) =>
							newestLoading ? (
								<Spinner />
							) : slides.length > 0 ? (
								slides.map((entity) => (
									<UserCard
										key={entity.id}
										entity={entity}
										isLiked={user ? entity.likes?.includes(user.id) : false}
									/>
								))
							) : (
								<div className="col-span-3 py-10 text-center text-gray-500">No users found.</div>
							)
						}
					</Carousel>
				</motion.section>

				{/* Random Users */}
				<motion.section
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					className="mb-20 mt-16"
				>
					<Carousel
						header={(next, prev, isPrev, isNext) => (
							<CarouselHeader
								title="Random Users"
								icon={<FaDice />}
								seeAll="/explore?sort=random"
								description="Some random profiles on Sociava"
								next={next}
								prev={prev}
								isPrev={isPrev}
								isNext={isNext}
							/>
						)}
						slides={randomUsers}
					>
						{(slides: Entity[]) =>
							randomLoading ? (
								<Spinner />
							) : slides.length > 0 ? (
								slides.map((entity) => (
									<UserCard
										key={entity.id}
										entity={entity}
										isLiked={user ? entity.likes?.includes(user.id) : false}
									/>
								))
							) : (
								<div className="col-span-3 py-10 text-center text-gray-500">No users found.</div>
							)
						}
					</Carousel>
				</motion.section>
			</div>
		</div>
	);
};

export default HeroLayout;
