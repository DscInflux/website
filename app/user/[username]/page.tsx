'use client';
import React, { Suspense } from 'react';
import { useParams, notFound } from 'next/navigation';
import UserProfile from '@/components/Layout/user';

const User = () => {
	const params = useParams();
	const username = typeof params.username === 'string' ? params.username : null;

	if (!username) return notFound();
	else
		return (
			<Suspense fallback={<div>Loading user data...</div>}>
				<UserProfile username={username} />
			</Suspense>
		);
};

export default User;
