"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { WidgetCard } from "@/components/cards/WidgetCard";

async function fetchUserData(username: string) {
  const res = await fetch(`https://dscinflux.xyz/api/get/entity?name=${username}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
}

export default function SearchWrapper() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    setLoading(true);
    setError(null);

    fetchUserData(username)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, [username]);

  if (!username) return <div>Please provide a username in query, e.g. /test?username=Ran</div>;
  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>Error: {error}</div>;

  return <WidgetCard profileData={data} />;
}
