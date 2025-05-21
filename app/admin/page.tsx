import AdminPanel from "@/components/Layout/Admin";
import React, { Suspense } from "react";

const AdminPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminPanel />
    </Suspense>
  );
};

export default AdminPage;
