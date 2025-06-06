import Link from 'next/link';
import { FaGithub, FaDiscord, FaExternalLinkAlt } from 'react-icons/fa';
import { SiX } from 'react-icons/si';
import React from 'react';

export default function Footer() {
	const items = [
		{ label: 'Home', link: '/', external: false },
		{ label: 'Explore', link: '/explore', external: false },
		{ label: 'Stats', link: '/stats', external: false },
		{
			label: 'Terms Of Service',
			link: 'https://purrquinox.com/terms',
			external: true
		},
		{
			label: 'Privacy Policy',
			link: 'https://purrquinox.com/privacy',
			external: true
		},
		{
			label: 'Cookie Policy',
			link: 'https://purrquinox.com/cookies',
			external: true
		},
		{ label: 'Status', link: 'https://status.purrquinox.com/', external: true }
	];

	const socialLinks = [
		{
			label: 'GitHub',
			icon: <FaGithub />,
			link: 'https://github.com/Sociava/'
		},
		{
			label: 'Discord',
			icon: <FaDiscord />,
			link: 'https://discord.gg/RPCtG7Em8g'
		},
		{ label: 'X', icon: <SiX />, link: 'https://x.com/HeySociava' }
	];

	return (
		<div className="font-jakarta mt-20 flex w-full justify-center px-6 sm:px-10 lg:px-12">
			<footer className="w-full max-w-7xl text-white">
				<div className="w-full border-t border-zinc-800 pt-12">
					<div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
						<Link href="/">
							<div className="text-2xl font-bold tracking-tight text-white transition hover:text-primary">
								Sociava
								<span className="block text-sm font-normal text-zinc-400">by Purrquinox</span>
							</div>
						</Link>

						<div className="flex space-x-3">
							{socialLinks.map(({ label, icon, link }, index) => (
								<a
									key={index}
									href={link}
									target="_blank"
									rel="noopener noreferrer"
									className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white transition duration-200 hover:bg-primary hover:text-white"
									title={label}
								>
									{icon}
									<span className="sr-only">{label}</span>
								</a>
							))}
						</div>
					</div>

					<ul className="mb-8 flex flex-wrap gap-4 text-sm font-medium text-zinc-400">
						{items.map(({ label, link, external }, index) => (
							<li key={index}>
								{external ? (
									<a
										href={link}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1 transition hover:text-white"
									>
										{label}
										<FaExternalLinkAlt className="inline-block text-xs" />
									</a>
								) : (
									<Link href={link}>
										<p className="transition hover:text-white">{label}</p>
									</Link>
								)}
							</li>
						))}
					</ul>

					<div className="mb-2 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-500">
						&copy; {new Date().getFullYear()} Purrquinox. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}
