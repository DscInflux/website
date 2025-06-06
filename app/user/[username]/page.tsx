'use client';
import React, { Suspense } from 'react';
import { useParams, notFound } from 'next/navigation';
import UserProfile from '@/components/Layout/user';

const fetchUserData = async (username: string) => {
	const res = await fetch(`https://dscinflux.xyz/api/get/entity?name=${username}`, {
		cache: 'no-store'
	});
	if (!res.ok) throw new Error('Failed to fetch user data');
	return res.json();
};

const wrapPromise = (promise: Promise<any>) => {
	let status = 'pending';
	let result: any;
	let suspender = promise.then(
		(res) => {
			status = 'success';
			result = res;
		},
		(err) => {
			status = 'error';
			result = err;
		}
	);

	return {
		read() {
			if (status === 'pending') throw suspender;
			if (status === 'error') throw result;
			return result;
		}
	};
};

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
