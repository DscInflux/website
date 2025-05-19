import UserProfile from "@/components/Layout/user";

export default function UserPage({ params }: { params: { username: string } }) {
  const { username } = params;

  return <UserProfile username={username} />;
}
