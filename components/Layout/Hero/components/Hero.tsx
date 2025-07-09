'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';

interface HeroProps {
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Hero = ({ onSubmit }: HeroProps) => {
	return (
		<div className="relative flex min-h-screen items-center justify-center">
			{/* Enhanced geometric background */}
			<div className="absolute inset-0">
				{/* Animated gradient orbs */}
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.6, 0.3]
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'easeInOut'
					}}
					className="absolute left-20 top-20 h-72 w-72 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl"
				/>
				<motion.div
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.2, 0.5, 0.2]
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: 2
					}}
					className="absolute bottom-32 right-20 h-96 w-96 rounded-full bg-gradient-to-l from-pink-500/20 to-purple-500/20 blur-3xl"
				/>

				{/* Floating geometric shapes */}
				<motion.div
					animate={{
						rotate: [0, 360],
						y: [0, -30, 0]
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: 'linear'
					}}
					className="absolute right-1/4 top-1/4 h-16 w-16 rotate-45 border-2 border-white/10"
				/>
				<motion.div
					animate={{
						rotate: [360, 0],
						x: [0, 50, 0]
					}}
					transition={{
						duration: 15,
						repeat: Infinity,
						ease: 'easeInOut'
					}}
					className="absolute bottom-1/3 left-1/3 h-12 w-12 rounded-full border border-white/20"
				/>

				{/* Sparkle effects */}
				{[...Array(8)].map((_, i) => (
					<motion.div
						key={i}
						animate={{
							scale: [0, 1, 0],
							opacity: [0, 1, 0],
							rotate: [0, 180, 360]
						}}
						transition={{
							duration: 3 + i * 0.5,
							repeat: Infinity,
							delay: i * 0.8,
							ease: 'easeInOut'
						}}
						className="absolute text-white/30"
						style={{
							left: `${10 + i * 10}%`,
							top: `${30 + (i % 3) * 20}%`
						}}
					>
						<HiSparkles size={12 + (i % 3) * 4} />
					</motion.div>
				))}
			</div>

			<div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 text-center">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="relative"
				>
					<motion.div
						animate={{
							scale: [1, 1.05, 1],
							textShadow: [
								'0 0 20px rgba(255,255,255,0.5)',
								'0 0 40px rgba(255,255,255,0.8)',
								'0 0 20px rgba(255,255,255,0.5)'
							]
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: 'easeInOut'
						}}
					>
						<h1 className="mb-8 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-7xl font-black leading-none tracking-tighter text-transparent text-white md:text-9xl">
							Find People
						</h1>
					</motion.div>

					<motion.div
						initial={{ width: 0 }}
						animate={{ width: '100%' }}
						transition={{ duration: 1.5, delay: 0.8 }}
						className="relative mx-auto mb-8 h-1 max-w-md bg-gradient-to-r from-transparent via-white to-transparent"
					>
						<motion.div
							animate={{ x: ['-100%', '100%'] }}
							transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
							className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
						/>
					</motion.div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="mb-8 flex items-center justify-center gap-3"
				>
					<HiLightningBolt className="text-3xl text-yellow-400" />
					<h2 className="text-5xl font-extralight tracking-wide text-gray-300 md:text-6xl">
						The Right Way
					</h2>
					<HiLightningBolt className="text-3xl text-yellow-400" />
				</motion.div>

				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className="mx-auto mb-16 max-w-4xl text-xl font-light leading-relaxed text-gray-400 md:text-2xl"
				>
					Find & add new friends on Discord the easy way. Connect with people who share your
					interests and build meaningful relationships.
				</motion.p>

				<motion.form
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.8 }}
					onSubmit={onSubmit}
					className="relative mx-auto mb-16 max-w-2xl"
				>
					<div className="group relative">
						<motion.div
							whileHover={{ scale: 1.02 }}
							whileFocus={{ scale: 1.02 }}
							className="relative"
						>
							{/* Increase z-index here */}
							<FiSearch className="absolute left-6 top-1/2 z-20 h-6 w-6 -translate-y-1/2 transform text-white" />

							{/* Reduce or remove z-index here */}
							<input
								type="text"
								name="username"
								placeholder="Enter username..."
								className="relative w-full rounded-2xl border-2 border-gray-800 bg-black/80 py-6 pl-16 pr-6 text-lg font-medium text-white placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-white focus:bg-black/90 focus:outline-none"
							/>
						</motion.div>
					</div>

					<motion.button
						whileHover={{
							scale: 1.05,
							y: -2,
							boxShadow: '0 20px 40px rgba(255,255,255,0.1)'
						}}
						whileTap={{ scale: 0.95 }}
						type="submit"
						className="relative mt-8 transform overflow-hidden rounded-2xl bg-gradient-to-r from-white to-gray-100 px-12 py-4 text-lg font-bold text-black shadow-2xl transition-all duration-300 hover:from-gray-100 hover:to-white"
					>
						<span className="relative z-10">Start Finding Friends</span>
						<motion.div
							animate={{ x: ['-100%', '100%'] }}
							transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
							className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
						/>
					</motion.button>
				</motion.form>

				{/* Call to action indicators */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2, duration: 0.8 }}
					className="flex items-center justify-center gap-2 text-sm text-gray-500"
				>
					<motion.div
						animate={{ scale: [1, 1.2, 1] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="h-2 w-2 rounded-full bg-white/50"
					/>
					<span>Scroll to explore</span>
					<motion.div
						animate={{ scale: [1, 1.2, 1] }}
						transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
						className="h-2 w-2 rounded-full bg-white/50"
					/>
				</motion.div>
			</div>
		</div>
	);
};

export default Hero;
