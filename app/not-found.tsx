'use client';

import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Background gradient */}
			<div className="color-layout layout-blue"></div>

			{/* Animated background shapes */}
			<div className="background-shapes"></div>

			<div className="relative z-10 flex min-h-screen items-center justify-center p-4">
				<div className="w-full max-w-2xl text-center">
					{/* 404 Animation */}
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, ease: 'easeOut' }}
						className="mb-8"
					>
						<motion.h1
							animate={{
								textShadow: [
									'0 0 20px rgba(79, 70, 229, 0.5)',
									'0 0 40px rgba(79, 70, 229, 0.8)',
									'0 0 20px rgba(79, 70, 229, 0.5)'
								]
							}}
							transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
							className="font-jakarta bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-9xl font-bold text-transparent md:text-[12rem]"
						>
							404
						</motion.h1>
					</motion.div>

					{/* Content card */}
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}
						className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-12 dark:border-white/10 dark:bg-black/20"
					>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="mb-6"
						>
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600">
								<Search className="h-8 w-8 text-white" />
							</div>
						</motion.div>

						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className="font-jakarta mb-4 text-3xl font-bold text-white md:text-4xl"
						>
							Page Not Found
						</motion.h2>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
							className="mb-8 text-lg leading-relaxed text-gray-300"
						>
							Oops! The page you're looking for seems to have vanished into the digital void. Don't
							worry, even the best explorers sometimes take a wrong turn.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 }}
							className="flex flex-col justify-center gap-4 sm:flex-row"
						>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => window.history.back()}
								className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-white/20"
							>
								<ArrowLeft className="h-5 w-5" />
								Go Back
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => (window.location.href = '/')}
								className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl"
							>
								<Home className="h-5 w-5" />
								Go Home
							</motion.button>
						</motion.div>
					</motion.div>

					{/* Floating animation elements */}
					{[...Array(5)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute h-4 w-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20"
							animate={{
								x: [0, 100, -100, 0],
								y: [0, -100, 100, 0],
								scale: [1, 1.5, 0.5, 1],
								opacity: [0.2, 0.8, 0.2]
							}}
							transition={{
								duration: 8 + i * 2,
								repeat: Number.POSITIVE_INFINITY,
								delay: i * 0.5,
								ease: 'easeInOut'
							}}
							style={{
								top: `${20 + i * 15}%`,
								left: `${10 + i * 20}%`
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
