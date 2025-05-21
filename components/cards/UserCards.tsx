"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaUserShield, FaCode, FaHandshake } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { motion } from "framer-motion";

type UserCardProps = {
  entity: any;
  isSkeleton?: boolean;
  isLiked?: boolean;
};

const UserCard: React.FC<UserCardProps> = ({
  entity,
  isSkeleton = false,
  isLiked = false,
}) => {
  const [liked, setLiked] = useState(isLiked);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

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
      const req = await sendRequest(
        `/api/post/entity/heart?action=unlike&url=${entity.url}`,
        "POST",
      );
      if (req.success) {
        setLiked(false);
      } else if (req.data?.length > 0) {
        setLiked((old: any) => req.data[0]?.isLiked ?? old);
      }
    } else {
      const req = await sendRequest(
        `/api/post/entity/heart?action=like&url=${entity.url}`,
        "POST",
      );
      if (req.success) {
        setLiked(true);
      } else if (req.data?.length > 0) {
        setLiked((old: any) => req.data[0]?.isLiked ?? old);
      }
    }
  };

  if (isSkeleton) {
    return (
      <div className="w-full h-[250px] bg-gray-100 dark:bg-dark rounded-xl overflow-hidden animate-pulse p-4" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full h-[250px] bg-white dark:bg-dark rounded-xl overflow-hidden select-none p-5 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
    >
      {/* Top: avatar + name */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-primary/20">
          <Image
            src={
              entity.avatar ||
              "https://purrquinox.com/_next/image?url=%2Flogo.png&w=32&q=75"
             }
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
          <h1 className="text-black dark:text-white text-lg font-bold flex items-center gap-1.5">
            {entity.discordUsername}
            {entity.isVerified && (
              <FaCircleCheck size={18} className="text-primary" />
            )}
            {entity.staff && (
              <FaUserShield className="text-red-500" title="Staff" />
            )}
            {entity.isDeveloper && (
              <FaCode className="text-green-500" title="Developer" />
            )}
            {entity.isPartner && (
              <FaHandshake className="text-yellow-500" title="Partner" />
            )}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            @{entity.url}
          </p>
        </div>
      </div>

      {/* Middle: about text */}
      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium overflow-hidden flex-grow mt-4 line-clamp-3">
        {typeof entity.about === "string"
          ? entity.about
          : JSON.stringify(entity.about)}
      </p>

      {/* Bottom: actions */}
      <div className="flex justify-between items-center gap-4 mt-4">
        <Link 
          href={`/user/${entity.url}`}
          className="flex-grow py-2.5 px-4 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-all duration-200 text-center"
        >
          View Profile
        </Link>

        <button
          onClick={toggleLike}
          className="w-10 h-10 flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          type="button"
        >
          {liked ? (
            <FaHeart className="text-red-500" size={18} />
          ) : (
            <FaRegHeart className="text-gray-500 dark:text-gray-400" size={18} />
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default UserCard;
