import Explore from "@/components/Layout/Explore";
import React, { Suspense, useEffect, useState } from "react";

const ExploresPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Explore />
    </Suspense>
  );
};

export default ExploresPage;
