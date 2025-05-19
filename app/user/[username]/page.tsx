import { notFound } from 'next/navigation';
import UserProfile from '@/components/Layout/user';

type PageProps = {
  params: {
    username: string;
  };
};

export default function UserPage({ params }: PageProps) {
  const username = typeof params.username === 'string' ? params.username : null;

  if (!username) {
    notFound();
  }

  return <UserProfile username={username} />;
}
