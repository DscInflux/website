'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw, Bug, Shield, Database, Wifi, Clock } from 'lucide-react';
import { Suspense } from 'react';

function ErrorContent() {
	const searchParams = useSearchParams();

	// Get error details from query params
	const error = searchParams.get('error');
	const errorDescription = searchParams.get('error_description');
	const errorCode = searchParams.get('code') || '500';

	// Common NextAuth errors
	const nextAuthErrors: Record<string, { title: string; description: string; icon: any }> = {
		Configuration: {
			title: 'Configuration Error',
			description: 'There is a problem with the server configuration.',
			icon: Bug
		},
		AccessDenied: {
			title: 'Access Denied',
			description: 'You do not have permission to sign in.',
			icon: Shield
		},
		Verification: {
			title: 'Verification Error',
			description: 'The verification token has expired or has already been used.',
			icon: Clock
		},
		Default: {
			title: 'Authentication Error',
			description: 'An error occurred during authentication.',
			icon: Shield
		}
	};

	// Determine error type and details
	const getErrorDetails = () => {
		if (error && nextAuthErrors[error]) {
			return nextAuthErrors[error];
		}

		switch (errorCode) {
			case '404':
				return {
					title: 'Page Not Found',
					description: 'The page you are looking for does not exist.',
					icon: AlertTriangle
				};
			case '403':
				return {
					title: 'Forbidden',
					description: 'You do not have permission to access this resource.',
					icon: Shield
				};
			case '500':
				return {
					title: 'Internal Server Error',
					description: 'Something went wrong on our end.',
					icon: Database
				};
			case '503':
				return {
					title: 'Service Unavailable',
					description: 'The service is temporarily unavailable.',
					icon: Wifi
				};
			default:
				return {
					title: 'Something Went Wrong',
					description: 'An unexpected error occurred.',
					icon: AlertTriangle
				};
		}
	};

	const errorDetails = getErrorDetails();
	const IconComponent = errorDetails.icon;

	// Get all query parameters for debugging
	const allParams = Object.fromEntries(searchParams.entries());

	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Background gradient */}
			<div className="color-layout layout-blue"></div>

			{/* Animated background shapes */}
			<div className="background-shapes"></div>

			<div className="relative z-10 flex min-h-screen items-center justify-center p-4">
				<div className="w-full max-w-2xl">
					{/* Main error card */}
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: 'easeOut' }}
						className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-12 dark:border-white/10 dark:bg-black/20"
					>
						{/* Error icon with animation */}
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{
								delay: 0.2,
								duration: 0.5,
								type: 'spring',
								stiffness: 200
							}}
							className="mb-8 flex justify-center"
						>
							<div className="relative">
								<motion.div
									animate={{
										rotate: [0, 5, -5, 0],
										scale: [1, 1.05, 1]
									}}
									transition={{
										duration: 3,
										repeat: Number.POSITIVE_INFINITY,
										ease: 'easeInOut'
									}}
									className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg"
								>
									<IconComponent className="h-12 w-12 text-white" />
								</motion.div>

								{/* Floating particles */}
								{[...Array(3)].map((_, i) => (
									<motion.div
										key={i}
										className="absolute h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
										animate={{
											x: [0, 20, -20, 0],
											y: [0, -30, -10, 0],
											opacity: [0, 1, 0]
										}}
										transition={{
											duration: 2,
											repeat: Number.POSITIVE_INFINITY,
											delay: i * 0.5,
											ease: 'easeInOut'
										}}
										style={{
											top: `${20 + i * 10}%`,
											left: `${30 + i * 20}%`
										}}
									/>
								))}
							</div>
						</motion.div>

						{/* Error code */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
							className="mb-4 text-center"
						>
							<span className="inline-block rounded-full border border-red-500/30 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400">
								Error {errorCode}
							</span>
						</motion.div>

						{/* Error title */}
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							className="font-jakarta mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl"
						>
							{errorDetails.title}
						</motion.h1>

						{/* Error description */}
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className="mb-8 text-center text-lg leading-relaxed text-gray-300"
						>
							{errorDescription || errorDetails.description}
						</motion.p>

						{/* Action buttons */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
							className="mb-8 flex flex-col justify-center gap-4 sm:flex-row"
						>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => (window.location.href = '/')}
								className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl"
							>
								<Home className="h-5 w-5" />
								Go Home
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => window.location.reload()}
								className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-white/20"
							>
								<RefreshCw className="h-5 w-5" />
								Try Again
							</motion.button>
						</motion.div>

						{/* Query parameters debug info */}
						{Object.keys(allParams).length > 0 && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								transition={{ delay: 0.8 }}
								className="border-t border-white/10 pt-6"
							>
								<details className="group">
									<summary className="flex cursor-pointer items-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-white">
										<Bug className="h-4 w-4" />
										Debug Information
										<motion.div
											animate={{ rotate: 0 }}
											className="transition-transform duration-200 group-open:rotate-90"
										>
											▶
										</motion.div>
									</summary>

									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4"
									>
										<h4 className="mb-3 text-sm font-medium text-gray-300">Query Parameters:</h4>
										<div className="space-y-2">
											{Object.entries(allParams).map(([key, value]) => (
												<div
													key={key}
													className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3"
												>
													<span className="rounded bg-blue-400/10 px-2 py-1 font-mono text-xs text-blue-400">
														{key}
													</span>
													<span className="break-all font-mono text-xs text-gray-300">{value}</span>
												</div>
											))}
										</div>
									</motion.div>
								</details>
							</motion.div>
						)}
					</motion.div>

					{/* Floating elements */}
					<motion.div
						animate={{
							y: [0, -10, 0],
							rotate: [0, 5, -5, 0]
						}}
						transition={{
							duration: 4,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'easeInOut'
						}}
						className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-xl"
					/>

					<motion.div
						animate={{
							y: [0, 15, 0],
							rotate: [0, -5, 5, 0]
						}}
						transition={{
							duration: 5,
							repeat: Number.POSITIVE_INFINITY,
							ease: 'easeInOut',
							delay: 1
						}}
						className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-xl"
					/>
				</div>
			</div>
		</div>
	);
}

export default function ErrorPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
				</div>
			}
		>
			<ErrorContent />
		</Suspense>
	);
}
