"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/ui/global/Carousel";
import CarouselHeader from "@/components/ui/global/Carousel-Header";
import UserCard from "@/components/cards/UserCards";
import {
  FaFire,
  FaDice,
  FaArrowRight,
  FaDiscord,
  FaSearch,
} from "react-icons/fa";
import type { Entity } from "@/types/entity";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const HeroLayout = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");

  const user = session?.user || null;

  // --- React Query: Fetch users for carousels ---
  const {
    data: popularUsers = [],
    isLoading: popularLoading,
    error: popularError,
  } = useQuery({
    queryKey: ["hero-popular-users"],
    queryFn: async () => {
      const res = await fetch("/api/get/entity/all?sort=popular&limit=10");
      const data = await res.json();
      return data?.data || [];
    },
  });
  const {
    data: newestUsers = [],
    isLoading: newestLoading,
    error: newestError,
  } = useQuery({
    queryKey: ["hero-newest-users"],
    queryFn: async () => {
      const res = await fetch("/api/get/entity/all?sort=newest&limit=10");
      const data = await res.json();
      return data?.data || [];
    },
  });
  const {
    data: randomUsers = [],
    isLoading: randomLoading,
    error: randomError,
  } = useQuery({
    queryKey: ["hero-random-users"],
    queryFn: async () => {
      const res = await fetch("/api/get/entity/all?sort=random&limit=10");
      const data = await res.json();
      return data?.data || [];
    },
  });
  const isLoading = popularLoading || newestLoading || randomLoading;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (
      e.currentTarget.username as HTMLInputElement
    ).value.trim();
    if (username) {
      router.push(`/explore?name=${encodeURIComponent(username)}`);
    }
  };

  return (
    <div className="relative z-10 px-6 3xl:px-0 font-jakarta">
      <div className="background-shapes absolute inset-0"></div>

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center justify-between py-24 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left w-full lg:max-w-2xl"
          >
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full mb-6 font-medium text-sm">
              Find people the right way.
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-black dark:text-white relative">
              Start{" "}
              <span className="text-primary relative">
                Finding{" "}
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-primary/20 rounded-full"></span>
              </span>{" "}
              Friends
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 font-medium max-w-xl">
              Find & add new friends on Discord the easy way. Connect with
              people who share your interests.
            </p>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                onSubmit={handleSubmit}
                className="mt-8 w-full max-w-xl"
              >
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-grow w-full relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaSearch />
                    </div>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter Discord username"
                      required
                      className="w-full h-[56px] pl-10 pr-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-[56px] w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    <FaSearch  className="text-lg" />
                    Find
                  </button>
                </div>
              </motion.form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block w-full max-w-md perspective-right"
          >
            <div className="relative w-full h-[400px] bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="absolute top-6 left-6 right-6 bottom-6">
                <div className="absolute top-0 left-0 w-16 h-16 bg-primary/20 rounded-full"></div>
                <div className="absolute bottom-12 right-4 w-24 h-24 bg-primary/10 rounded-full"></div>
                <div className="absolute top-1/3 right-8 w-8 h-8 bg-primary/30 rounded-full"></div>

                <div className="absolute top-10 right-10 w-32 h-32 rounded-xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                  <Image
                    src="https://purrquinox.com/_next/image?url=%2Flogo.png&w=32&q=75"
                    alt="Discord user"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>

                <div className="absolute bottom-10 left-10 w-64 h-32 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <FaDiscord />
                    </div>
                    <div>
                      <div className="font-bold text-black dark:text-white">
                        DiscordUser
                      </div>
                      <div className="text-xs text-gray-500">@username</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                    Connect with friends who share your interests in gaming,
                    art, music and more!
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Popular Users */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-20"
        >
          <Carousel
            header={(next, prev, isPrev, isNext) => (
              <CarouselHeader
                title="Popular Users"
                icon={<FaFire />}
                seeAll="/explore?sort=likes"
                description="The most popular profiles on Sociava"
                next={next}
                prev={prev}
                isPrev={isPrev}
                isNext={isNext}
              />
            )}
            slides={popularUsers}
          >
            {(slides: Entity[]) =>
              popularLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <UserCard
                        key={`skeleton-${i}`}
                        entity={{}}
                        isSkeleton={true}
                      />
                    ))
                : slides.length > 0
                  ? slides.map((entity) => (
                      <UserCard
                        key={entity.id}
                        entity={entity}
                        isLiked={user ? entity.likes?.includes(user.id) : false}
                      />
                    ))
                  : [
                      <div
                        key="no-users"
                        className="col-span-3 text-center py-10 text-gray-500"
                      >
                        No users found.
                      </div>,
                    ]
            }
          </Carousel>
        </motion.section>

        {/* Newest Users */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16"
        >
          <Carousel
            header={(next, prev, isPrev, isNext) => (
              <CarouselHeader
                title="Newest Users"
                icon={<FaDice />}
                seeAll="/explore?sort=newest"
                description="Some newest profiles on Sociava"
                next={next}
                prev={prev}
                isPrev={isPrev}
                isNext={isNext}
              />
            )}
            slides={newestUsers}
          >
            {(slides: Entity[]) =>
              newestLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <UserCard
                        key={`skeleton-${i}`}
                        entity={{}}
                        isSkeleton={true}
                      />
                    ))
                : slides.length > 0
                  ? slides.map((entity) => (
                      <UserCard
                        key={entity.id}
                        entity={entity}
                        isLiked={user ? entity.likes?.includes(user.id) : false}
                      />
                    ))
                  : [
                      <div
                        key="no-users"
                        className="col-span-3 text-center py-10 text-gray-500"
                      >
                        No users found.
                      </div>,
                    ]
            }
          </Carousel>
        </motion.section>

        {/* Random Users */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 mb-20"
        >
          <Carousel
            header={(next, prev, isPrev, isNext) => (
              <CarouselHeader
                title="Random Users"
                icon={<FaDice />}
                seeAll="/explore?sort=random"
                description="Some random profiles on Sociava"
                next={next}
                prev={prev}
                isPrev={isPrev}
                isNext={isNext}
              />
            )}
            slides={randomUsers}
          >
            {(slides: Entity[]) =>
              randomLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <UserCard
                        key={`skeleton-${i}`}
                        entity={{}}
                        isSkeleton={true}
                      />
                    ))
                : slides.length > 0
                  ? slides.map((entity) => (
                      <UserCard
                        key={entity.id}
                        entity={entity}
                        isLiked={user ? entity.likes?.includes(user.id) : false}
                      />
                    ))
                  : [
                      <div
                        key="no-users"
                        className="col-span-3 text-center py-10 text-gray-500"
                      >
                        No users found.
                      </div>,
                    ]
            }
          </Carousel>
        </motion.section>
      </div>
    </div>
  );
};

export default HeroLayout;
