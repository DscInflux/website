'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import UserCard from '@/components/cards/UserCards';
import { Entity } from '@/types/entity';
import { useSession } from 'next-auth/react';

interface UserCarouselProps {
	title: string;
	users: { entity: Entity; isLiked: boolean }[];
	isLoading: boolean;
}

const UserCarousel = ({ title, users, isLoading }: UserCarouselProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const cardWidth = 320; // width of a single card in pixels (must match CSS)
	const visibleCards = 3;
	const totalCards = users.length;
	const maxIndex = Math.max(0, totalCards - visibleCards);

	const { data: session } = useSession();
	const user = session?.user;

	const nextSlide = () => {
		setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
	};

	const prevSlide = () => {
		setCurrentIndex((prev) => Math.max(prev - 1, 0));
	};

	if (isLoading) {
		return (
			<div className="py-20">
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="mb-12 text-center text-5xl font-black tracking-tight text-white"
				>
					{title}
				</motion.h2>
				<div className="mx-auto flex max-w-7xl justify-center space-x-8 px-6">
					{[...Array(3)].map((_, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className="h-96 w-[320px] rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800"
						/>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="relative py-20">
			<motion.h2
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				viewport={{ once: true }}
				className="mb-16 text-center text-5xl font-black tracking-tight text-white"
			>
				{title}
			</motion.h2>

			<div className="relative mx-auto max-w-[1024px] px-6">
				<div className="overflow-hidden">
					<motion.div
						animate={{ x: -currentIndex * (cardWidth + 24) }} // 24 = gap-6
						transition={{ type: 'spring', stiffness: 300, damping: 30 }}
						className="flex gap-6"
						style={{ width: `${cardWidth * totalCards + 24 * (totalCards - 1)}px` }}
					>
						{users.map((userObj, index) => (
							<motion.div
								key={userObj.entity.id}
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.05 }}
								viewport={{ once: true }}
								className="w-[320px] shrink-0"
							>
								<UserCard user={userObj.entity} isLiked={userObj.isLiked} />
							</motion.div>
						))}
					</motion.div>
				</div>

				{/* Arrows */}
				{totalCards > visibleCards && (
					<>
						<motion.button
							whileHover={{ scale: 1.1, x: -5 }}
							whileTap={{ scale: 0.9 }}
							onClick={prevSlide}
							className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-700 bg-black/80 p-3 text-white shadow-xl backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-black"
						>
							<FiChevronLeft className="h-6 w-6" />
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.1, x: 5 }}
							whileTap={{ scale: 0.9 }}
							onClick={nextSlide}
							className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-700 bg-black/80 p-3 text-white shadow-xl backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-black"
						>
							<FiChevronRight className="h-6 w-6" />
						</motion.button>
					</>
				)}
			</div>

			{/* Pagination dots */}
			{totalCards > visibleCards && (
				<div className="mt-12 flex justify-center space-x-3">
					{Array.from({ length: maxIndex + 1 }, (_, i) => (
						<motion.button
							key={i}
							whileHover={{ scale: 1.2 }}
							whileTap={{ scale: 0.8 }}
							onClick={() => setCurrentIndex(i)}
							className={`h-3 w-3 rounded-full transition-all duration-300 ${
								i === currentIndex ? 'scale-125 bg-white' : 'bg-gray-600'
							}`}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default UserCarousel;
