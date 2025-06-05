import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Static/Navbar";
import Footer from "@/components/Static/Footer";
import { ThemeProvider, SessionProviders } from "../components/Provider";
import { generateMetadata } from "@/lib/Metadata";
import { ReactQueryProviders } from "@/components/Provider";
import ConnectingDots from "@/components/ui/global/ConnectingDots";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = generateMetadata({});

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
        <ConnectingDots
          dotColor="rgba(255, 255, 255, 0.7)"
          lineColor="rgba(255, 255, 255, 0.3)"
          dotCount={200}
          lineThreshold={150}
        />
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
