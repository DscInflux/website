'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { PaletteIcon, Check } from 'lucide-react';

interface Theme {
	id: string;
	label: string;
}

const ThemeSelector: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();
	const dropdownRef = useRef<HTMLDivElement>(null);

	const themes: Theme[] = [
		// Original themes
		{ id: 'dark', label: 'Dark' }
	];

	const getThemeColors = (themeId: string) => {
		switch (themeId) {
			// Original themes
			case 'dark':
				return 'from-[hsl(268,95%,55%)] to-[hsl(244,80%,65%)]';

			default:
				return 'from-primary to-extra';
		}
	};

	// Set mounted to true once the component is mounted
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (theme && mounted) {
			document.documentElement.classList.add('theme-transition');
			setTimeout(() => {
				document.documentElement.classList.remove('theme-transition');
			}, 300);
		}
	}, [theme, mounted]);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="group flex items-center justify-center rounded-full p-2 transition-all hover:bg-accent"
				aria-label="Change theme"
			>
				<div className="relative">
					<PaletteIcon className="group-hover:text-foreground h-5 w-5 text-muted-foreground transition-colors" />
				</div>
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 10 }}
						transition={{ duration: 0.15 }}
						className="absolute right-0 z-50 mt-2 w-72 rounded-lg border border-border bg-card p-3 shadow-xl backdrop-blur-sm"
					>
						<div className="mb-2 border-b border-border pb-2">
							<h3 className="text-foreground text-sm font-medium">Select Theme</h3>
							<p className="mt-1 text-xs text-muted-foreground">
								Customize your interface appearance
							</p>
						</div>

						<div className="grid grid-cols-2 gap-2">
							{themes.map((themeOption) => {
								const isActive = theme === themeOption.id;
								return (
									<button
										key={themeOption.id}
										onClick={() => {
											setTheme(themeOption.id);
											setIsOpen(false);
										}}
										className={`relative rounded-lg p-4 transition-all duration-200 ${
											isActive ? 'shadow-lg ring-2 ring-primary' : 'hover:bg-accent/50'
										} bg-gradient-to-br ${getThemeColors(themeOption.id)} group`}
									>
										<div className="absolute inset-0 rounded-lg bg-black opacity-60 transition-opacity group-hover:opacity-50" />

										<div className="relative flex items-center justify-between">
											<span className="text-sm font-medium text-white">{themeOption.label}</span>
											{isActive && (
												<span className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md">
													<Check className="h-3 w-3 text-primary" />
												</span>
											)}
										</div>

										<div className="relative mt-2 flex space-x-1">
											<span className="h-2 w-2 rounded-full bg-white opacity-60" />
											<span className="h-2 w-2 rounded-full bg-white opacity-80" />
											<span className="h-2 w-2 rounded-full bg-white" />
										</div>
									</button>
								);
							})}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ThemeSelector;
