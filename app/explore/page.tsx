import Explore from "@/components/Layout/Explore";
import React, { Suspense } from "react";

const ExploresPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Explore />
    </Suspense>
  );
};

export default ExploresPage;
