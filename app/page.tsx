import HeroLayout from "@/components/Layout/Hero";
import { generateHomeMetadata } from '@/lib/Metadata';
import { Metadata } from 'next';
import { website_url } from "@/lib/siteConfig";

export const metadata: Metadata = generateHomeMetadata({
	website_url: `${website_url}/`
});

export default function HomePage() {
  return <HeroLayout />;
}
