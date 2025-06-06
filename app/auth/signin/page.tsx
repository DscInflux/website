import SignInPage from '@/components/Layout/Auth/SignIn';
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { website_url } from '@/lib/siteConfig';
import { generateSigninMetadata } from '@/lib/Metadata';

export const metadata: Metadata = generateSigninMetadata({
	website_url: `${website_url}/auth/signin`
});

const SigninPage = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SignInPage />
		</Suspense>
	);
};

export default SigninPage;
