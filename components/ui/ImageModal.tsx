'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Download, Share2, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageModalProps {
	isOpen: boolean;
	onClose: () => void;
	src: string;
	alt: string;
	type: 'avatar' | 'banner';
	username?: string;
}

export default function ImageModal({
	isOpen,
	onClose,
	src,
	alt,
	type,
	username = 'User'
}: ImageModalProps) {
	const [isZoomed, setIsZoomed] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);

	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	// Reset zoom when modal opens/closes
	useEffect(() => {
		if (!isOpen) {
			setIsZoomed(false);
			setImageLoaded(false);
		}
	}, [isOpen]);

	const handleDownload = async () => {
		try {
			const response = await fetch(src);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${username}-${type}.jpg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Error downloading image:', error);
		}
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: `${username}'s ${type}`,
					text: `Check out ${username}'s ${type}!`,
					url: window.location.href
				});
			} catch (error) {
				console.error('Error sharing:', error);
			}
		} else {
			// Fallback to copying URL
			navigator.clipboard.writeText(window.location.href);
			// You could add a toast notification here
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="fixed inset-0 z-50 flex items-center justify-center"
					onClick={onClose}
				>
					{/* Backdrop with blur */}
					<motion.div
						initial={{ backdropFilter: 'blur(0px)' }}
						animate={{ backdropFilter: 'blur(20px)' }}
						exit={{ backdropFilter: 'blur(0px)' }}
						transition={{ duration: 0.3 }}
						className="absolute inset-0 bg-black/60 dark:bg-black/80"
					/>

					{/* Modal content */}
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						transition={{ duration: 0.3, type: 'spring', damping: 20 }}
						className="relative mx-4 max-h-[90vh] w-full max-w-7xl overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm dark:bg-white/5"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="absolute left-0 right-0 top-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
							<div className="flex items-center justify-between p-6">
								<div className="flex items-center gap-4">
									<button
										onClick={onClose}
										className="rounded-full bg-black/20 p-2 text-white transition-all duration-200 hover:scale-110 hover:bg-black/40"
									>
										<X className="h-6 w-6" />
									</button>
									<div>
										<h2 className="text-xl font-semibold text-white">
											{username}'s {type === 'avatar' ? 'Avatar' : 'Banner'}
										</h2>
										<p className="text-sm text-white/70">Click and drag to zoom</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<button
										onClick={() => setIsZoomed(!isZoomed)}
										className="rounded-full bg-black/20 p-2 text-white transition-all duration-200 hover:scale-110 hover:bg-black/40"
										title={isZoomed ? 'Zoom Out' : 'Zoom In'}
									>
										{isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
									</button>
									<button
										onClick={handleShare}
										className="rounded-full bg-black/20 p-2 text-white transition-all duration-200 hover:scale-110 hover:bg-black/40"
										title="Share"
									>
										<Share2 className="h-5 w-5" />
									</button>
									<button
										onClick={handleDownload}
										className="rounded-full bg-black/20 p-2 text-white transition-all duration-200 hover:scale-110 hover:bg-black/40"
										title="Download"
									>
										<Download className="h-5 w-5" />
									</button>
								</div>
							</div>
						</div>

						{/* Image container */}
						<div className="relative flex h-full min-h-[60vh] w-full items-center justify-center overflow-hidden">
							{!imageLoaded && (
								<div className="absolute inset-0 flex items-center justify-center">
									<motion.div
										animate={{ rotate: 360 }}
										transition={{
											duration: 1,
											repeat: Infinity,
											ease: 'linear'
										}}
										className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white"
									/>
								</div>
							)}

							<motion.div
								animate={{
									scale: isZoomed ? 1.15 : 1
								}}
								transition={{ duration: 0.3, type: 'spring', damping: 20 }}
								className={`relative ${
									type === 'avatar'
										? 'h-96 w-96 overflow-hidden rounded-full'
										: 'flex max-h-[70vh] w-full max-w-full items-center justify-center overflow-hidden rounded-xl'
								} cursor-pointer shadow-2xl`}
								onClick={() => setIsZoomed(!isZoomed)}
							>
								<Image
									src={src}
									alt={alt}
									{...(type === 'avatar' ? { fill: true } : { width: 1200, height: 400 })}
									className={`object-cover transition-all duration-300 ${
										imageLoaded ? 'opacity-100' : 'opacity-0'
									} ${
										type === 'banner' ? 'h-auto max-h-[70vh] w-auto max-w-full object-contain' : ''
									}`}
									onLoad={() => setImageLoaded(true)}
									priority
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
								/>

								{/* Hover overlay */}
								<motion.div
									initial={{ opacity: 0 }}
									whileHover={{ opacity: 1 }}
									className="absolute inset-0 flex items-center justify-center bg-black/20"
								>
									<motion.div
										initial={{ scale: 0.8 }}
										whileHover={{ scale: 1 }}
										className="rounded-full bg-white/20 p-3 backdrop-blur-sm"
									>
										{isZoomed ? (
											<ZoomOut className="h-8 w-8 text-white" />
										) : (
											<ZoomIn className="h-8 w-8 text-white" />
										)}
									</motion.div>
								</motion.div>
							</motion.div>
						</div>

						{/* Bottom gradient for better visibility */}
						<div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Hook to use with your existing UserProfile component
export function useImageModal() {
	const [modalState, setModalState] = useState<{
		isOpen: boolean;
		src: string;
		alt: string;
		type: 'avatar' | 'banner';
		username?: string;
	}>({
		isOpen: false,
		src: '',
		alt: '',
		type: 'avatar',
		username: ''
	});

	const openModal = (src: string, alt: string, type: 'avatar' | 'banner', username?: string) => {
		setModalState({
			isOpen: true,
			src,
			alt,
			type,
			username
		});
	};

	const closeModal = () => {
		setModalState((prev) => ({ ...prev, isOpen: false }));
	};

	return {
		modalState,
		openModal,
		closeModal
	};
}
