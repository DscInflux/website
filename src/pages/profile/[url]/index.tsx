import { useEffect, useState } from 'react';
import UserPage from '@/components/Global/User';
import { NextSeo } from "next-seo";

export default function UserProfilePage({ url }) {
  const [userData, setUserData] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/v1/entity/${url}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data.data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [apiUrl, url]);

  return (
    <>
      <NextSeo
        title="Profile"
        description="View and make friends with person mentioned on the profile."
        openGraph={{
          images: [
            {
              url: `https://cdn.dscinflux.xyz/assets/png/influx.png`,
              width: 800,
              height: 600,
              alt: "Influx Logo",
            },
          ],
        }}
        twitter={{
          cardType: "summary",
        }}
      />
      <div>
        {/* Render the UserPage component with fetched userData */}
        {userData && <UserPage data={userData} />}
      </div>
    </>
  );
}

// This function will be called at build time
export async function getServerSideProps(ctx) {
  // Extract the user URL from the context
  const { url } = ctx.query;

  // Pass the user URL as a prop to the component
  return {
    props: {
      url
    }
  };
}
