'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { FaDiscord, FaGithub, FaTwitter, FaSignInAlt } from 'react-icons/fa';

export default function SignInPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [particles, setParticles] = useState<
		Array<{ id: number; x: number; y: number; delay: number }>
	>([]);

	useEffect(() => {
		// Generate floating particles
		const newParticles = Array.from({ length: 20 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			delay: Math.random() * 2
		}));
		setParticles(newParticles);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsLoading(false);
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#030207] via-[#090b24] to-[#1a1a2e]">
			{/* Animated Background Particles */}
			<div className="absolute inset-0">
				{particles.map((particle) => (
					<motion.div
						key={particle.id}
						className="absolute h-1 w-1 rounded-full bg-blue-400 opacity-60"
						style={{
							left: `${particle.x}%`,
							top: `${particle.y}%`
						}}
						animate={{
							y: [0, -20, 0],
							opacity: [0.3, 0.8, 0.3],
							scale: [1, 1.5, 1]
						}}
						transition={{
							duration: 3 + particle.delay,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'easeInOut',
							delay: particle.delay
						}}
					/>
				))}
			</div>

			{/* Morphing Background Shapes */}
			<motion.div
				className="absolute left-0 top-0 h-96 w-96 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl filter"
				animate={{
					x: [0, 100, 0],
					y: [0, 50, 0],
					scale: [1, 1.2, 1]
				}}
				transition={{
					duration: 8,
					repeat: Number.POSITIVE_INFINITY,
					ease: 'easeInOut'
				}}
			/>

			<motion.div
				className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gradient-to-l from-pink-600/20 to-indigo-600/20 blur-3xl filter"
				animate={{
					x: [0, -80, 0],
					y: [0, -60, 0],
					scale: [1, 1.3, 1]
				}}
				transition={{
					duration: 10,
					repeat: Number.POSITIVE_INFINITY,
					ease: 'easeInOut',
					delay: 1
				}}
			/>

			{/* Main Content */}
			<div className="relative z-10 flex min-h-screen items-center justify-center p-4">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					className="w-full max-w-md"
				>
					{/* Floating Header */}
					<motion.div
						className="mb-8 text-center"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<motion.div
							className="relative mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
							whileHover={{ scale: 1.1, rotate: 5 }}
							whileTap={{ scale: 0.95 }}
						>
							<FaSignInAlt className="h-8 w-8 text-white" />
							<motion.div
								className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-75"
								animate={{ rotate: 360 }}
								transition={{
									duration: 20,
									repeat: Number.POSITIVE_INFINITY,
									ease: 'linear'
								}}
							/>
						</motion.div>

						<motion.h1
							className="font-jakarta mb-2 text-3xl font-bold text-white"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							Welcome Back
						</motion.h1>

						<motion.p
							className="font-jakarta text-gray-400"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 }}
						>
							Sign in with your favorite platform
						</motion.p>
					</motion.div>

					{/* Social Login Buttons Only */}
					<motion.div
						className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, delay: 0.3 }}
						whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
					>
						<motion.div
							className="grid grid-cols-1 gap-4"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.5 }}
						>
							<motion.button
								type="button"
								className="font-jakarta flex items-center justify-center gap-3 rounded-xl border-none bg-[#5865F2]/90 px-4 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#5865F2]"
								whileHover={{ scale: 1.03, y: -2 }}
								whileTap={{ scale: 0.97 }}
								onClick={() => signIn('discord', { callbackUrl: '/' })}
							>
								<FaDiscord className="h-6 w-6" />
								Continue with Discord
							</motion.button>
							<motion.button
								type="button"
								className="font-jakarta flex items-center justify-center gap-3 rounded-xl border-none bg-[#24292F]/90 px-4 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#24292F]"
								whileHover={{ scale: 1.03, y: -2 }}
								whileTap={{ scale: 0.97 }}
								onClick={() => signIn('github', { callbackUrl: '/' })}
							>
								<FaGithub className="h-6 w-6" />
								Continue with GitHub
							</motion.button>
							<motion.button
								type="button"
								className="font-jakarta flex items-center justify-center gap-3 rounded-xl border-none bg-[#1DA1F2]/90 px-4 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#1DA1F2]"
								whileHover={{ scale: 1.03, y: -2 }}
								whileTap={{ scale: 0.97 }}
								onClick={() => signIn('twitter', { callbackUrl: '/' })}
							>
								<FaTwitter className="h-6 w-6" />
								Continue with Twitter
							</motion.button>
						</motion.div>
					</motion.div>
				</motion.div>
			</div>

			{/* Floating Elements */}
			<motion.div
				className="absolute right-20 top-20 h-4 w-4 rounded-full bg-blue-400 opacity-60"
				animate={{
					y: [0, -20, 0],
					rotate: [0, 180, 360]
				}}
				transition={{
					duration: 4,
					repeat: Number.POSITIVE_INFINITY,
					ease: 'easeInOut'
				}}
			/>

			<motion.div
				className="absolute bottom-20 left-20 h-6 w-6 rounded-full bg-purple-400 opacity-40"
				animate={{
					x: [0, 20, 0],
					scale: [1, 1.2, 1]
				}}
				transition={{
					duration: 5,
					repeat: Number.POSITIVE_INFINITY,
					ease: 'easeInOut',
					delay: 1
				}}
			/>
		</div>
	);
}
