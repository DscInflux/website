import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Static/Navbar";
import Footer from "@/components/Static/Footer";
import { ThemeProvider, SessionProviders } from "../components/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DscInflux",
  description: "Connecting people with the same interests",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "DscInflux",
    description: "Connecting people with the same interests",
    url: "https://dscinflux.xyz",
    siteName: "DscInflux",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/144157365?s=400&u=01ff974164b5dae27dbe879c10fe2d7ca94a8f74&v=4",
        width: 800,
        height: 600,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DscInflux",
    description: "Connecting people with the same interests",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/144157365?s=400&u=01ff974164b5dae27dbe879c10fe2d7ca94a8f74&v=4",
        width: 800,
        height: 600,
      },
    ],
    creator: "@heypurrquinox",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SessionProviders>
            <Navbar />
            <img
              src="https://dscinfluxcnd.vercel.app/assets/png/backwave.png"
              width="55%"
              className="absolute top-0 right-0 hidden lg:block z-[-1] opacity-50"
            />
            {children}
            <Footer />
          </SessionProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
