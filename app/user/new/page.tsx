import EditPage from '@/components/Layout/user/new';
import { Metadata } from 'next';
import { website_url } from '@/lib/siteConfig';
import { generateUserSettingsMetadata } from '@/lib/Metadata';

export const metadata: Metadata = generateUserSettingsMetadata({
	website_url: `${website_url}/user/new`
});

export default function UserNewPage() {
	return <EditPage />;
}
