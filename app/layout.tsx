import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Static/Navbar';
import Footer from '@/components/Static/Footer';
import { ThemeProvider, SessionProviders } from '../components/Provider';
import { generateMetadata } from '@/lib/Metadata';
import { ReactQueryProviders } from '@/components/Provider';
import ConnectingDots from '@/components/ui/global/ConnectingDots';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
});

export const metadata: Metadata = generateMetadata({});

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<div className="opacity-25">
					<ConnectingDots />
				</div>

				<ThemeProvider>
					<SessionProviders>
						<ReactQueryProviders>
							<Navbar />
							{children}
							<Footer />
						</ReactQueryProviders>
					</SessionProviders>
				</ThemeProvider>
			</body>
		</html>
	);
}
