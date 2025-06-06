import Stats from '@/components/Layout/Stats';
import { generateStatsMetadata } from '@/lib/Metadata';
import { Metadata } from 'next';
import { website_url } from '@/lib/siteConfig';

export const metadata: Metadata = generateStatsMetadata({
	website_url: `${website_url}/stats`
});

const StatsPage = () => {
	return <Stats />;
};

export default StatsPage;
