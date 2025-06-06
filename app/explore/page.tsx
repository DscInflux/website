import Explore from '@/components/Layout/Explore';
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { website_url } from '@/lib/siteConfig';
import { generateExploreMetadata } from '@/lib/Metadata';

export const metadata: Metadata = generateExploreMetadata({
	website_url: `${website_url}/explore`
});

const ExploresPage = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Explore />
		</Suspense>
	);
};

export default ExploresPage;
