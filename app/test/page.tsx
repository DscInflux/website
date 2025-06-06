import React, { Suspense } from 'react';
import ClientSearchWrapper from './SearchWrapper';

export default function TestPage() {
	return (
		<Suspense fallback={<div>Loading user data...</div>}>
			<ClientSearchWrapper />
		</Suspense>
	);
}
