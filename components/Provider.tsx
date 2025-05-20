"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}

export function SessionProviders({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
