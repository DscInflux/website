import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Entity } from "@/types/entity";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { CheckCircle } from "lucide-react";

type MiniCardProps = {
  entity: Entity;
  isSkeleton?: boolean;
};

export default function MiniCard({ entity, isSkeleton = false }: MiniCardProps) {
  const [liked, setLiked] = useState(entity.isLiked || false);

  async function sendRequest(endpoint: string, method: string) {
    try {
      const res = await fetch(endpoint, { method });
      if (!res.ok) throw new Error("Request failed");
      return await res.json();
    } catch {
      return { success: false };
    }
  }

  const toggleLike = async () => {
    if (liked) {
      const req = await sendRequest(`/entity/${entity.url}/unlike`, "POST");
      if (req.success) {
        setLiked(false);
      } else if (req.data?.length > 0) {
        setLiked((old) => req.data[0]?.isLiked ?? old);
      }
    } else {
      const req = await sendRequest(`/entity/${entity.url}/like`, "POST");
      if (req.success) {
        setLiked(true);
      } else if (req.data?.length > 0) {
        setLiked((old) => req.data[0]?.isLiked ?? old);
      }
    }
  };

  if (isSkeleton) {
    return (
      <div className="user-select-none w-full bg-light dark:bg-dark rounded-lg overflow-hidden animate-pulse p-4">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-zinc-500/20 dark:bg-zinc-500/20 w-16 h-16" />
          <div className="flex flex-col flex-grow space-y-2">
            <div className="h-5 bg-zinc-500/20 dark:bg-zinc-500/20 rounded w-1/2" />
            <div className="h-4 bg-zinc-500/20 dark:bg-zinc-500/20 rounded w-1/4" />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-4 bg-zinc-500/20 dark:bg-zinc-500/20 rounded w-full" />
          <div className="h-4 bg-zinc-500/20 dark:bg-zinc-500/20 rounded w-5/6" />
          <div className="h-4 bg-zinc-500/20 dark:bg-zinc-500/20 rounded w-3/4" />
        </div>
        <div className="flex gap-4 mt-6">
          <div className="bg-zinc-500/20 dark:bg-zinc-500/20 h-12 rounded flex-grow" />
          <div className="bg-zinc-500/20 dark:bg-zinc-500/20 h-12 w-12 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-light dark:bg-dark rounded-lg overflow-hidden select-none p-4">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full ring-4 ring-light dark:ring-dark ring-offset-0 overflow-hidden">
          <Image
            src={entity.avatar || "/avatar.png"}
            alt={`${entity.discord.username} avatar`}
            fill
            sizes="64px"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/avatar.png";
            }}
          />
        </div>
        <div>
          <h1 className="text-black dark:text-white text-lg font-medium flex items-center gap-1">
            {entity.discord.username}
            {entity.isVerified && <CheckCircle size={18} className="text-blue-500" />}
          </h1>
          <p className="text-sm text-black dark:text-gray-500 font-medium">@{entity.url}</p>
        </div>
      </div>

      <p className="text-sm text-black/75 dark:text-gray-500 font-medium line-clamp-3 h-16 overflow-hidden mt-6">
        {typeof entity.about === "string" ? entity.about : JSON.stringify(entity.about)}
      </p>

      <div className="flex justify-end items-center gap-4 mt-4">
        <Link href={`/profile/${entity.url}`} legacyBehavior>
          <a className="w-full h-12 inline-flex justify-center items-center border border-transparent rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            View Profile
          </a>
        </Link>

        <button
          onClick={toggleLike}
          className="px-0 w-12 h-12 flex justify-center items-center flex-shrink-0 bg-transparent border-none cursor-pointer text-red-600 text-xl"
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          type="button"
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
}
