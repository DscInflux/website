import AdminPanel from "@/components/Layout/Admin";
import React, { Suspense } from "react";
import { Metadata } from "next";
import { website_url } from "@/lib/siteConfig";
import { generateAdminMetadata } from "@/lib/Metadata";

export const metadata: Metadata = generateAdminMetadata({
  website_url: `${website_url}/admin`,
});

const AdminPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPanel />
    </Suspense>
  );
};

export default AdminPage;
