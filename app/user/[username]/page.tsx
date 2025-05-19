import UserProfile from "@/components/Layout/user/";


export default function UserPage({ params }: { params: { username: string } }) {
  return <UserProfile params={params} />;
}
