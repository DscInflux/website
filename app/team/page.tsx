import StaffPage from '@/components/Layout/Team';
import { generateTeamsMetadata } from '@/lib/Metadata';
import { Metadata } from 'next';
import { website_url } from '@/lib/siteConfig';

export const metadata: Metadata = generateTeamsMetadata({
	website_url: `${website_url}/team`
});

const TeamsPage = () => {
	return <StaffPage />;
};

export default TeamsPage;
