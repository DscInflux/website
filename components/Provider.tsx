'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

interface ProvidersProps {
	children: React.ReactNode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
			{children}
		</NextThemesProvider>
	);
}

export function SessionProviders({ children }: ProvidersProps) {
	return <SessionProvider>{children}</SessionProvider>;
}

export function ReactQueryProviders({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
