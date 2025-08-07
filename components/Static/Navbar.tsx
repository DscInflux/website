'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	FiHome,
	FiSearch,
	FiUser,
	FiUsers,
	FiSettings,
	FiMenu,
	FiX,
	FiChevronDown
} from 'react-icons/fi';
import { FaSignInAlt, FaSignOutAlt, FaEye, FaEdit, FaUserPlus, FaCogs } from 'react-icons/fa';
import { signOut, signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
	className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { data: session } = useSession();
	const [entityUrl, setEntityUrl] = useState<string | null>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	useEffect(() => {
		if (!session?.user?.discordId) return;

		fetch(`/api/get/entity?userId=${session.user.discordId}`)
			.then(async (res) => {
				if (res.ok) {
					const data = await res.json();
					setEntityUrl(data?.url || null);
				} else {
					setEntityUrl(null);
				}
			})
			.catch(() => setEntityUrl(null));
	}, [session]);

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}, [isMobileMenuOpen]);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const navItems = [
		{ icon: FiHome, label: 'Home', href: '/', isActive: false },
		{ icon: FiSearch, label: 'Search', href: '/explore', isActive: false },
		{ icon: FiUsers, label: 'Stats', href: '/stats', isActive: false },
		{ icon: FiUser, label: 'Edit/Make Profile', href: '/user/new', isActive: false }
	];

	const NavItem: React.FC<{
		icon: React.ElementType;
		label: string;
		isActive?: boolean;
		href: string;
		onClick?: () => void;
	}> = ({ icon: Icon, label, isActive = false, href, onClick }) => (
		<Link
			href={href}
			onClick={onClick}
			aria-label={label}
			className={`flex cursor-pointer items-center space-x-2 transition-colors duration-200 ${
				isActive ? 'text-white' : 'text-gray-400 hover:text-white'
			}`}
		>
			<motion.div
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				className="flex items-center space-x-2"
			>
				<Icon size={20} aria-hidden="true" />
				<span className="text-sm font-medium md:hidden">{label}</span>
			</motion.div>
		</Link>
	);

	const UserDropdown = () => {
		if (!session) {
			return (
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => signIn()}
					aria-label="Login to your account"
					className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-100"
				>
					<FaSignInAlt className="mr-2 inline-block" aria-hidden="true" />
					Login
				</motion.button>
			);
		}

		return (
			<div className="relative">
				<button
					onClick={() => setDropdownOpen((prev) => !prev)}
					aria-label={`User menu for ${session.user?.name || 'User'}`}
					aria-expanded={dropdownOpen}
					aria-haspopup="true"
					className="flex items-center space-x-2 rounded-full border border-gray-700 p-1 pr-3 transition hover:bg-gray-800"
				>
					<Image
						src={session.user?.avatar || ''}
						alt={`${session.user?.name || 'User'}'s avatar`}
						width={32}
						height={32}
						className="rounded-full"
					/>
					<motion.div
						initial={false}
						animate={{ rotate: dropdownOpen ? 180 : 0 }}
						transition={{ type: 'spring', stiffness: 300, damping: 20 }}
						className="inline-block origin-center text-white"
					>
						<FiChevronDown size={16} aria-hidden="true" />
					</motion.div>
				</button>

				<AnimatePresence>
					{dropdownOpen && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-gray-800 bg-black text-white shadow-lg"
							role="menu"
							aria-labelledby="user-menu-button"
						>
							<div className="py-2">
								{entityUrl ? (
									<>
										<Link
											href={`/user/${entityUrl}`}
											className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
											aria-label="View your profile"
											role="menuitem"
											onClick={() => setDropdownOpen(false)}
										>
											<FaEye className="mr-2" aria-hidden="true" />
											View Profile
										</Link>
										<Link
											href="/user/new"
											className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
											aria-label="Edit your profile"
											role="menuitem"
											onClick={() => setDropdownOpen(false)}
										>
											<FaEdit className="mr-2" aria-hidden="true" />
											Edit Profile
										</Link>
										<Link
											href="/user/settings"
											className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
											aria-label="Account settings"
											role="menuitem"
											onClick={() => setDropdownOpen(false)}
										>
											<FiSettings className="mr-2" aria-hidden="true" />
											Settings
										</Link>
									</>
								) : (
									<button
										onClick={() => {
											setDropdownOpen(false);
											window.location.href = '/user/new';
										}}
										className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
										aria-label="Register a new profile"
										role="menuitem"
									>
										<FaUserPlus className="mr-2" aria-hidden="true" />
										Register Profile
									</button>
								)}

								{session.user?.is_admin && (
									<Link
										href="/admin"
										className="flex items-center px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-gray-100 dark:text-indigo-400 dark:hover:bg-zinc-700"
										aria-label="Admin panel"
										role="menuitem"
										onClick={() => setDropdownOpen(false)}
									>
										<FaCogs className="mr-2" aria-hidden="true" />
										Admin
									</Link>
								)}

								<button
									onClick={() => {
										setDropdownOpen(false);
										signOut();
									}}
									className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
									aria-label="Logout from your account"
									role="menuitem"
								>
									<FaSignOutAlt className="mr-2" aria-hidden="true" />
									Logout
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	};

	return (
		<>
			{/* Desktop Navbar */}
			<motion.nav
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
				className={`fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 transform md:block ${className}`}
				role="navigation"
				aria-label="Main navigation"
			>
				<div className="rounded-full border border-gray-800 bg-black/90 px-6 py-3 shadow-2xl backdrop-blur-md lg:px-8 lg:py-4">
					<div className="flex items-center space-x-6 lg:space-x-8">
						{navItems.map((item, index) => (
							<NavItem
								key={index}
								icon={item.icon}
								label={item.label}
								isActive={item.isActive}
								href={item.href}
							/>
						))}
						<UserDropdown />
					</div>
				</div>
			</motion.nav>

			{/* Mobile Navbar */}
			<motion.nav
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
				className={`fixed left-4 right-4 top-4 z-50 md:hidden ${className}`}
				role="navigation"
				aria-label="Mobile navigation"
			>
				<div className="rounded-2xl border border-gray-800 bg-black/90 px-4 py-3 shadow-2xl backdrop-blur-md">
					<div className="flex items-center justify-between">
						<motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
							<img src="https://sociava.xyz/logo.webp" alt="Sociava Logo" className="h-8 w-auto" />
						</motion.div>

						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={toggleMobileMenu}
							className="rounded-full p-2 text-white transition-colors hover:bg-gray-800"
							aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
							aria-expanded={isMobileMenuOpen}
						>
							{isMobileMenuOpen ? (
								<FiX size={24} aria-hidden="true" />
							) : (
								<FiMenu size={24} aria-hidden="true" />
							)}
						</motion.button>
					</div>
				</div>
			</motion.nav>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsMobileMenuOpen(false)}
							className="fixed inset-0 z-40 bg-black/50 md:hidden"
							aria-hidden="true"
						/>
						<motion.div
							initial={{ y: -20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -20, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="fixed left-4 right-4 top-[80px] z-50 rounded-2xl border border-gray-800 bg-black/90 px-4 py-6 shadow-2xl backdrop-blur-md md:hidden"
							role="menu"
							aria-label="Mobile navigation menu"
						>
							<div className="space-y-4">
								{navItems.map((item, index) => (
									<div key={index} role="menuitem">
										<NavItem
											icon={item.icon}
											label={item.label}
											isActive={item.isActive}
											href={item.href}
											onClick={() => setIsMobileMenuOpen(false)}
										/>
									</div>
								))}
								<div role="menuitem">
									<UserDropdown />
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

export default Navbar;
