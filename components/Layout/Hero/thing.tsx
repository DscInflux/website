'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { FaGoogle, FaEnvelope, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { FaXTwitter, FaDiscord } from 'react-icons/fa6';

interface SignInDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

function SignInDrawer({ isOpen, onClose }: SignInDrawerProps) {
	const [step, setStep] = useState<'social' | 'email' | 'password'>('social');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isPeeking, setIsPeeking] = useState(false);

	const y = useMotionValue(0);

	// Show peek on mobile after a delay
	useEffect(() => {
		if (!isOpen) {
			const timer = setTimeout(() => {
				setIsPeeking(true);
			}, 2000);
			return () => clearTimeout(timer);
		} else {
			setIsPeeking(false);
		}
	}, [isOpen]);

	const handleDragEnd = (event: any, info: PanInfo) => {
		const shouldClose = info.velocity.y > 500 || info.offset.y > 200;
		if (shouldClose) {
			onClose();
			setStep('social');
		}
	};

	const handleEmailNext = () => {
		if (email.trim()) {
			setStep('password');
		}
	};

	const handleSignIn = () => {
		console.log('Sign in with:', { email, password });
		onClose();
	};

	const handleSocialLogin = (provider: string) => {
		console.log('Sign in with:', provider);
		onClose();
	};

	const resetToSocial = () => {
		setStep('social');
		setEmail('');
		setPassword('');
	};

	const handlePeekClick = () => {
		setIsPeeking(false);
		// Trigger the parent's open function (assuming you'll pass it)
	};

	return (
		<>
			{/* Peek indicator for iOS-style behavior */}
			<motion.div
				className="fixed bottom-0 left-1/2 z-[9997] -translate-x-1/2 transform md:hidden"
				initial={{ y: '100%' }}
				animate={{ y: isPeeking && !isOpen ? '-8px' : '100%' }}
				transition={{ type: 'spring', damping: 20, stiffness: 200 }}
				onClick={handlePeekClick}
			>
				<div className="rounded-t-2xl border border-border bg-card px-6 py-3 shadow-lg">
					<div className="mx-auto mb-2 h-1 w-12 rounded-full bg-muted-foreground/40" />
					<p className="text-center text-sm text-muted-foreground">Sign In</p>
				</div>
			</motion.div>

			{/* Background Overlay */}
			<motion.div
				className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm md:hidden"
				initial={{ opacity: 0 }}
				animate={{ opacity: isOpen ? 1 : 0 }}
				transition={{ duration: 0.3 }}
				style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
				onClick={onClose}
			/>

			{/* Drawer */}
			<motion.div
				className="fixed inset-x-0 bottom-0 z-[9999] mx-auto max-w-md rounded-t-3xl border-t border-border bg-card text-card-foreground shadow-2xl md:hidden"
				style={{ y }}
				initial={{ y: '100%' }}
				animate={{ y: isOpen ? 0 : '100%' }}
				transition={{
					type: 'spring',
					damping: 25,
					stiffness: 200
				}}
				drag="y"
				dragConstraints={{ top: -100, bottom: 0 }}
				dragElastic={0.2}
				onDragEnd={handleDragEnd}
			>
				<div className="min-h-[500px] p-6 pb-10">
					{/* Drag Handle */}
					<div className="mx-auto mb-8 h-1.5 w-12 cursor-grab rounded-full bg-muted-foreground/40 active:cursor-grabbing" />

					{/* Content */}
					<div>
						<h2 className="mb-3 text-center text-3xl font-bold text-foreground">Sign In</h2>
						<p className="mb-8 text-center text-base text-muted-foreground">
							Welcome back! Please sign in to continue
						</p>

						{step === 'social' && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className="space-y-6"
							>
								{/* Social Login Buttons - In a row */}
								<div className="mb-8 grid grid-cols-3 gap-4">
									<button
										onClick={() => handleSocialLogin('discord')}
										className="flex items-center justify-center rounded-xl bg-[#5865F2] py-5 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-[#4752C4] active:scale-95"
									>
										<FaDiscord className="text-2xl" />
									</button>

									<button
										onClick={() => handleSocialLogin('google')}
										className="flex items-center justify-center rounded-xl border border-border bg-white py-5 font-medium text-black transition-all duration-200 hover:scale-105 hover:bg-gray-50 active:scale-95"
									>
										<FaGoogle className="text-2xl text-red-500" />
									</button>

									<button
										onClick={() => handleSocialLogin('twitter')}
										className="flex items-center justify-center rounded-xl bg-foreground py-5 font-medium text-background transition-all duration-200 hover:scale-105 hover:bg-foreground/90 active:scale-95"
									>
										<FaXTwitter className="text-2xl" />
									</button>
								</div>

								{/* Divider */}
								<div className="mb-6 flex items-center gap-4">
									<div className="h-px flex-1 bg-border"></div>
									<span className="text-sm text-muted-foreground">or continue with email</span>
									<div className="h-px flex-1 bg-border"></div>
								</div>

								{/* Email Input */}
								<div className="relative mb-6">
									<input
										type="email"
										placeholder="Enter your email address"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full rounded-xl border border-input bg-background px-4 py-4 pr-12 text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
										onKeyPress={(e) => e.key === 'Enter' && handleEmailNext()}
									/>
									<FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
								</div>

								<button
									onClick={handleEmailNext}
									disabled={!email.trim()}
									className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-base font-medium text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
								>
									Continue with Email
									<FaArrowRight className="text-sm" />
								</button>
							</motion.div>
						)}

						{step === 'password' && (
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="space-y-6"
							>
								{/* Email Display */}
								<div className="mb-6 rounded-xl bg-muted px-5 py-4">
									<p className="mb-1 text-sm text-muted-foreground">Signing in as:</p>
									<p className="text-base font-medium text-foreground">{email}</p>
									<button
										onClick={resetToSocial}
										className="mt-2 text-sm text-primary transition-colors hover:text-primary/80"
									>
										Change email address
									</button>
								</div>

								{/* Password Input */}
								<div className="relative mb-4">
									<input
										type={showPassword ? 'text' : 'password'}
										placeholder="Enter your password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="w-full rounded-xl border border-input bg-background px-4 py-4 pr-12 text-base text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
										onKeyPress={(e) => e.key === 'Enter' && handleSignIn()}
									/>
									<button
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-4 top-1/2 -translate-y-1/2 transform text-muted-foreground transition-colors hover:text-foreground"
									>
										{showPassword ? (
											<FaEyeSlash className="text-lg" />
										) : (
											<FaEye className="text-lg" />
										)}
									</button>
								</div>

								{/* Forgot Password */}
								<div className="mb-6 text-right">
									<button className="text-sm text-primary transition-colors hover:text-primary/80">
										Forgot your password?
									</button>
								</div>

								<button
									onClick={handleSignIn}
									disabled={!password.trim()}
									className="mb-4 w-full rounded-xl bg-primary py-4 text-base font-medium text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
								>
									Sign In to Your Account
								</button>

								<button
									onClick={resetToSocial}
									className="flex w-full items-center justify-center gap-2 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									← Back to sign in options
								</button>
							</motion.div>
						)}
					</div>
				</div>

				{/* Safe area for iPhone home indicator */}
				<div className="h-safe-area-inset-bottom bg-card" />
			</motion.div>
		</>
	);
}

export default SignInDrawer;
