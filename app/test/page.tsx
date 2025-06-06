import React, { Suspense } from "react";

// Move the useSearchParams hook into a client component
import SearchWrapper from "./SearchWrapper";

export default function TestPage() {
  return (
    <Suspense fallback={<div>Loading user data...</div>}>
      <SearchWrapper />
    </Suspense>
  );
}
