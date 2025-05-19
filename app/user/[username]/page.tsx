'use client';

import { useParams, notFound } from 'next/navigation';
import UserProfile from '@/components/Layout/user';

export default function UserPage() {
  const params = useParams();

  const username = typeof params.username === 'string' ? params.username : null;

  if (!username) {
    notFound();
  }

  return <UserProfile username={username} />;
}
