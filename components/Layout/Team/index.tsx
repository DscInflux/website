'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import ImageModal, { useImageModal } from '@/components/ui/ImageModal';

interface StaffMember {
	id: string;
	username: string;
	display_name: string;
	avatar: string;
}

interface TeamData {
	staff: StaffMember[];
}

const TeamPage = () => {
	const { openModal, modalState, closeModal } = useImageModal();
	// --- React Query: Fetch team data ---
	const {
		data: teamData,
		isLoading: loading,
		error
	} = useQuery({
		queryKey: ['team'],
		queryFn: async () => {
			const response = await fetch('/api/get/team');
			if (!response.ok) throw new Error('Network response was not ok');
			return (await response.json()) as TeamData;
		}
	});

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3
			}
		}
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 12
			}
		},
		hover: {
			y: -10,
			transition: {
				type: 'spring',
				stiffness: 300,
				damping: 10
			}
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<motion.div
					animate={{
						rotate: 360
					}}
					transition={{
						duration: 1,
						repeat: Infinity,
						ease: 'linear'
					}}
					className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
				/>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="max-w-lg rounded-xl bg-red-50 p-8 text-center dark:bg-red-900/20">
					<h2 className="mb-2 text-2xl font-bold text-red-700 dark:text-red-400">Error</h2>
					<p className="text-red-600 dark:text-red-300">
						{error instanceof Error ? error.message : String(error)}
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="relative min-h-screen overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
				{/* Background elements */}
				<div className="background-shapes" />
				<div className="color-layout layout-blue" />

				<div className="mx-auto max-w-7xl">
					{/* Header section */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="mb-16 text-center"
					>
						<div className="mb-4 flex items-center justify-center">
							<FaUsers className="mr-3 text-4xl text-primary" />
							<h1 className="font-jakarta bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl dark:from-indigo-400 dark:to-purple-400">
								Our Team
							</h1>
						</div>
						<p className="mx-auto mt-4 max-w-3xl text-xl text-gray-600 dark:text-gray-300">
							Meet the talented individuals behind our success, dedicated to delivering exceptional
							experiences.
						</p>
					</motion.div>

					{/* Team members grid */}
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2"
					>
						{teamData?.staff.map((member) => (
							<motion.div
								key={member.id}
								variants={itemVariants}
								whileHover="hover"
								className="perspective-right group relative"
							>
								<div className="absolute inset-0 -z-10 transform rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 opacity-0 transition-transform duration-300 group-hover:scale-[1.03] group-hover:opacity-100" />

								<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl dark:border-gray-700 dark:bg-gray-900/90">
									<div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
										<div className="relative">
											<div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 opacity-30 blur-md transition-opacity duration-300 group-hover:opacity-60" />
											<motion.div
												whileHover={{ scale: 1.05 }}
												transition={{
													type: 'spring',
													stiffness: 300,
													damping: 10
												}}
												className="relative"
											>
												<img
													src={member.avatar}
													alt={member.username}
													className="h-28 w-28 cursor-pointer rounded-full border-4 border-white object-cover md:h-32 md:w-32 dark:border-gray-800"
													onClick={() =>
														openModal(
															member.avatar,
															`${member.display_name}'s avatar`,
															'avatar',
															member.username
														)
													}
												/>
											</motion.div>
										</div>

										<div className="flex-1">
											<h2 className="mb-1 text-2xl font-bold text-gray-800 dark:text-white">
												{member.display_name}
											</h2>
											<p className="mb-4 font-medium text-purple-600 dark:text-purple-400">
												@{member.username}
											</p>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>

					{/* Call to action */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.6 }}
						className="mt-20 text-center"
					>
						<div className="relative inline-block">
							<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-xl" />
							<div className="relative rounded-xl border border-gray-200 bg-white/80 p-8 dark:border-gray-700 dark:bg-gray-900/80">
								<h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
									Want to join our team?
								</h3>
								<p className="mb-6 text-gray-600 dark:text-gray-300">
									We're always looking for talented individuals to join our growing team.
								</p>
								<motion.button
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/30"
								>
									View Careers
								</motion.button>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
			<ImageModal
				isOpen={modalState.isOpen}
				onClose={closeModal}
				src={modalState.src}
				alt={modalState.alt}
				type={modalState.type}
				username={modalState.username}
			/>
		</>
	);
};

export default TeamPage;
