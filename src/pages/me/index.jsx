import React from "react";
import UserPage from "@/components/Global/User";
import withSession from "@/libraries/withSession";
import { request } from "@/utils/apiHandler";

export default function User({ data }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-primary text-white py-6">
        {/* Include your header content here */}
      </header>
      <main className="container mx-auto px-4 py-8">
        <UserPage data={data} />
      </main>
      <footer className="bg-gray-200 py-4">
        {/* Include your footer content here */}
      </footer>
    </div>
  );
}

export const getServerSideProps = withSession(async (ctx) => {
  try {
    const response = await request(
      "/entity/" + ctx.query.id,
      "GET",
      null,
      ctx.req.session.get("access_token"),
    );
    if (response.success && response.data) {
      return {
        props: {
          data: response.data,
        },
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (e) {
    return {
      notFound: true,
    };
  }
});
