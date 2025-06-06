"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WidgetCard } from "@/components/cards/WidgetCard";

function wrapPromise(promise: Promise<any>) {
  let status = "pending";
  let result: any;
  let suspender = promise.then(
    (res) => {
      status = "success";
      result = res;
    },
    (err) => {
      status = "error";
      result = err;
    }
  );
  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      return result;
    },
  };
}

async function fetchUserData(username: string) {
  const res = await fetch(`https://dscinflux.xyz/api/get/entity?name=${username}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
}

function UserData({ resource }: { resource: { read: () => any } }) {
  const data = resource.read();
  return <WidgetCard profileData={data} />;
}

function UserWidget({ username }: { username: string }) {
  const userDataPromise = fetchUserData(username);
  const resource = wrapPromise(userDataPromise);
  return <UserData resource={resource} />;
}

export default function SearchWrapper() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  if (!username) return <div>Please provide a username in query, e.g. /test?username=Ran</div>;

  return <UserWidget username={username} />;
}
