import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaUserShield, FaCode, FaHandshake } from "react-icons/fa";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

type MiniCardProps = {
  entity: any;
  isSkeleton?: boolean;
  isLiked?: boolean;
};

const MiniCard: React.FC<MiniCardProps> = ({ entity, isSkeleton = false, isLiked = false }) => {
  const [liked, setLiked] = useState(isLiked);

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
      const req = await sendRequest(`/api/post/entity/heart?action=unlike&url=${entity.url}`, "POST");
      if (req.success) {
        setLiked(false);
      } else if (req.data?.length > 0) {
        setLiked((old: any) => req.data[0]?.isLiked ?? old);
      }
    } else {
      const req = await sendRequest(`/api/post/entity/heart?action=like&url=${entity.url}`, "POST");
      if (req.success) {
        setLiked(true);
      } else if (req.data?.length > 0) {
        setLiked((old: any) => req.data[0]?.isLiked ?? old);
      }
    }
  };

  if (isSkeleton) {
    return (
      <div className="w-full h-[350px] bg-light dark:bg-dark rounded-lg overflow-hidden animate-pulse p-4" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-[250px] w-[500px] bg-light dark:bg-dark rounded-lg overflow-hidden select-none p-4 flex flex-col justify-between"
    >
      {/* --- Top: avatar + name --- */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full ring-4 ring-light dark:ring-dark overflow-hidden">
          <Image
            src={entity.avatar || "https://purrquinox.com/_next/image?url=%2Flogo.png&w=32&q=75"}
            alt={`${entity.discordUsername} avatar`}
            fill
            sizes="64px"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://purrquinox.com/_next/image?url=%2Flogo.png&w=32&q=75";
            }}
          />
        </div>
        <div>
          <h1 className="text-black dark:text-white text-lg font-medium flex items-center gap-1">
            {entity.discordUsername}
            {entity.isVerified && <CheckCircle size={18} className="text-blue-500" />}
            {entity.staff && <FaUserShield className="text-red-500" title="Staff" />}
            {entity.isDeveloper && <FaCode className="text-green-500" title="Developer" />}
            {entity.isPartner && <FaHandshake className="text-yellow-500" title="Partner" />}
          </h1>
          <p className="text-sm text-black dark:text-gray-500 font-medium">@{entity.url}</p>
        </div>
      </div>

      {/* --- Middle: about text --- */}
      <p className="text-sm text-black/75 dark:text-gray-500 font-medium overflow-hidden flex-grow mt-4 line-clamp-3">
        {typeof entity.about === "string" ? entity.about : JSON.stringify(entity.about)}
      </p>

      {/* --- Bottom: actions --- */}
      <div className="flex justify-end items-center gap-4 mt-4">
        <Link href={`/user/${entity.url}`} legacyBehavior>
          <a className="w-full h-12 inline-flex justify-center items-center border border-transparent rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            View Profile
          </a>
        </Link>

        <button
          onClick={toggleLike}
          className="w-12 h-12 flex justify-center items-center bg-transparent border-none cursor-pointer text-red-600 text-xl"
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          type="button"
        >
          {liked ? <FaHeart color="#ef4444" /> : <FaRegHeart />}
        </button>
      </div>
    </motion.div>
  );
};

export default MiniCard;
