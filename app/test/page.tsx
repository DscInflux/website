import React, { Suspense } from "react";

import SearchWrapper from "./SearchWrapper";

export default function TestPage() {
  return (
    <Suspense fallback={<div>Loading user data...</div>}>
      <SearchWrapper />
    </Suspense>
  );
}
