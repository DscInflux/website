'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
	FaHome,
	FaCompass,
	FaUsers,
	FaUserPlus,
	FaSignOutAlt,
	FaBars,
	FaTimes,
	FaEdit,
	FaCogs,
	FaEye,
	FaSignInAlt
} from 'react-icons/fa';

const Navbar: React.FC = () => {
	const pathname = usePathname();
	const { data: session } = useSession();
	const [entityUrl, setEntityUrl] = useState<string | null>(null);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!session) return;
		if (session.user?.discordId) {
			fetch(`/api/get/entity?userId=${session.user.discordId}`)
				.then(async (res) => {
					if (res.ok) {
						const data = await res.json();
						if (data?.url) setEntityUrl(data.url);
						else setEntityUrl(null);
					} else {
						setEntityUrl(null);
					}
				})
				.catch(() => setEntityUrl(null));
		} else {
			setEntityUrl(null);
		}
	}, [session]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = () => signOut({ callbackUrl: '/' });

	const items = [
		{ label: 'Home', icon: <FaHome />, link: '/' },
		{ label: 'Explore', icon: <FaCompass />, link: '/explore' },
		{ label: 'Team', icon: <FaUsers />, link: '/team' }
	];

	return (
		<nav className="relative z-50 w-full bg-white dark:bg-black">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
				<Link href="/" className="text-2xl font-bold text-black dark:text-white">
					Sociava
				</Link>

				{/* Desktop Menu */}
				<div className="hidden items-center space-x-6 md:flex">
					{/* Navigation Items */}
					{items.map(({ label, icon, link }) => (
						<Link
							key={label}
							href={link}
							className={`flex items-center space-x-1 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 ${
								pathname === link
									? 'text-indigo-600 dark:text-indigo-400'
									: 'text-gray-800 dark:text-gray-300'
							}`}
						>
							{icon}
							<span>{label}</span>
						</Link>
					))}

					{/* User session */}
					{session ? (
						<div className="relative" ref={dropdownRef}>
							<button
								onClick={() => setIsDropdownOpen((prev) => !prev)}
								className="flex items-center space-x-2 focus:outline-none"
							>
								<img
									src={session.user?.avatar || ''}
									alt="avatar"
									className="h-8 w-8 rounded-full object-cover"
								/>
								<span className="font-medium text-gray-800 dark:text-white">
									{session.user?.display_name || session.user?.username || 'User'}
								</span>
							</button>

							{isDropdownOpen && (
								<div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-zinc-200 bg-white py-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
									{entityUrl ? (
										<>
											<Link
												href={`/user/${entityUrl}`}
												className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
											>
												<FaEye className="mr-2" />
												View Profile
											</Link>
											<Link
												href="/user/new"
												className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
											>
												<FaEdit className="mr-2" />
												Edit Profile
											</Link>
										</>
									) : (
										<button
											onClick={() => (window.location.href = '/user/new')}
											className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
										>
											<FaUserPlus className="mr-2" />
											Register Profile
										</button>
									)}
									{/* Admin Option */}
									{session.user?.is_admin && (
										<Link
											href="/admin"
											className="flex items-center px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-gray-100 dark:text-indigo-400 dark:hover:bg-zinc-700"
										>
											<FaCogs className="mr-2" />
											Admin
										</Link>
									)}
									<button
										onClick={() => (window.location.href = '/user/settings')}
										className="flex w-full items-center px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900"
									>
										User Settings
									</button>
									<button
										onClick={handleLogout}
										className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
									>
										<FaSignOutAlt className="mr-2" />
										Logout
									</button>
								</div>
							)}
						</div>
					) : (
						<button
							onClick={() => (window.location.href = '/auth/signin')}
							className="flex items-center space-x-2 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
						>
							<FaSignInAlt />
							<span>Login</span>
						</button>
					)}
				</div>

				{/* Mobile toggle */}
				<button
					className="text-2xl text-gray-800 md:hidden dark:text-white"
					onClick={() => setIsMobileOpen(!isMobileOpen)}
					aria-label="Toggle Menu"
				>
					{isMobileOpen ? <FaTimes /> : <FaBars />}
				</button>
			</div>

			{/* Mobile Dropdown */}
			{isMobileOpen && (
				<div className="space-y-4 bg-white px-4 pb-4 md:hidden dark:bg-black">
					{/* Navigation Items */}
					{items.map(({ label, icon, link }) => (
						<Link
							key={label}
							href={link}
							className={`flex items-center space-x-2 font-medium text-gray-700 hover:text-indigo-600 dark:text-zinc-200 dark:hover:text-indigo-400 ${
								pathname === link ? 'text-indigo-600 dark:text-indigo-400' : ''
							}`}
							onClick={() => setIsMobileOpen(false)}
						>
							{icon}
							<span>{label}</span>
						</Link>
					))}

					{session ? (
						<>
							{entityUrl ? (
								<>
									<Link
										href="/user/new"
										className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-zinc-200"
										onClick={() => setIsMobileOpen(false)}
									>
										<FaEdit />
										<span>Edit Profile</span>
									</Link>
									<Link
										href={`/user/${entityUrl}`}
										className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-zinc-200"
										onClick={() => setIsMobileOpen(false)}
									>
										<FaEye />
										<span>View Profile</span>
									</Link>
								</>
							) : (
								<button
									onClick={() => {
										setIsMobileOpen(false);
										window.location.href = '/user/new';
									}}
									className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-zinc-200"
								>
									<FaUserPlus />
									<span>Register Profile</span>
								</button>
							)}
							{/* Admin Option */}
							{session.user?.is_admin && (
								<Link
									href="/admin"
									className="flex items-center px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-gray-100 dark:text-indigo-400 dark:hover:bg-zinc-700"
									onClick={() => setIsMobileOpen(false)}
								>
									<FaCogs className="mr-2" />
									Admin
								</Link>
							)}
							<button
								onClick={() => {
									setIsMobileOpen(false);
									handleLogout();
								}}
								className="flex items-center space-x-2 text-red-600 hover:text-red-800"
							>
								<FaSignOutAlt />
								<span>Logout</span>
							</button>
						</>
					) : (
						<button
							onClick={() => {
								setIsMobileOpen(false);
								window.location.href = '/auth/signin';
							}}
							className="flex items-center space-x-2 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
						>
							<FaSignInAlt />
							<span>Login</span>
						</button>
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
