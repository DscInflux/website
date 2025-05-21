"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Carousel from "@/components/ui/global/Carousel";
import CarouselHeader from "@/components/ui/global/Carousel-Header";
import MiniCard from "@/components/cards/UserCards";
import { FaFire, FaDice, FaArrowRight } from "react-icons/fa";
import type { Entity } from "@/types/entity";
import type { User } from "@/types/users";
import Link from "next/link";

const HeroLayout: React.FC = () => {
  const router = useRouter();
  const [popularUsers, setPopularUsers] = useState<Entity[]>([]);
  const [randomUsers, setRandomUsers] = useState<Entity[]>([]);
  const [newestUsers, setNewestUsers] = useState<Entity[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [popularRes, newestRes, randomRes, meRes] = await Promise.all([
          fetch("/api/get/entity/all?sort=popular&limit=10"),
          fetch("/api/get/entity/all?sort=newest&limit=10"),
          fetch("/api/get/entity/all?sort=random&limit=10"),
          fetch("/api/auth/me"),
        ]);

        const [popularData, newestData, randomData, meData] = await Promise.all(
          [
            popularRes.json(),
            newestRes.json(),
            randomRes.json(),
            meRes.ok ? meRes.json() : Promise.resolve(null),
          ],
        );

        setPopularUsers(popularData?.data || []);
        setNewestUsers(newestData?.data || []);
        setRandomUsers(randomData?.data || []);
        setUser(meData?.user || null);
      } catch {
        setPopularUsers([]);
        setNewestUsers([]);
        setRandomUsers([]);
        setUser(null);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (
      e.currentTarget.username as HTMLInputElement
    ).value.trim();
    if (username) {
      router.push(`/submit?url=${encodeURIComponent(username)}`);
    }
  };

  return (
    <div className="relative z-10 px-6 3xl:px-0 font-jakarta">
      <div className="background-shapes absolute inset-0"></div>

      <div className="max-w-7xl mx-auto">
        <section className="flex flex-col lg:flex-row items-center justify-between py-24 gap-12">
          <div className="text-center lg:text-left w-full lg:max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-black dark:text-white relative">
              Start <span className="text-primary">Finding</span> Friends
              <span className="absolute text-[8rem] font-extrabold opacity-5 top-0 left-0 hidden lg:block pointer-events-none select-none text-primary">
                introducing
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 font-medium">
              Find & add new friends on Discord the easy way.
            </p>

            {user?.appId ? (
              <div className="mt-6">
                <Link href="/explore" legacyBehavior>
                  <a className="inline-flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-full hover:bg-secondary transition-all font-semibold">
                    Explore
                    <FaArrowRight className="ml-2" />
                  </a>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 w-full max-w-xl">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-grow w-full">
                    <input
                      type="text"
                      name="username"
                      placeholder="RanveerSoni"
                      required
                      className="w-full h-[50px] px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white rounded-md outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-[50px] w-full sm:w-auto px-8 bg-primary text-white font-semibold rounded-md hover:bg-secondary transition-colors"
                  >
                    Find
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Optional illustration/image could be here */}
        </section>

        {/* Popular Users */}
        <section className="mt-20">
          <Carousel
            header={(next, prev, isPrev, isNext) => (
              <CarouselHeader
                title="Popular Users"
                icon={
                  <FaFire className="text-primary text-5xl hidden lg:block" />
                }
                seeAll="/explore?sort=likes"
                description="The most popular profiles on DscInflux"
                next={next}
                prev={prev}
                isPrev={isPrev}
                isNext={isNext}
              />
            )}
            slides={popularUsers}
          >
            {(slides: Entity[]) =>
              slides.length > 0
                ? slides.map((entity) => (
                    <MiniCard
                      key={entity.id}
                      entity={entity}
                      isLiked={user ? entity.likes?.includes(user.id) : false}
                    />
                  ))
                : [<div key="no-users">No users found.</div>]
            }
          </Carousel>
        </section>

        {/* Newest Users */}
        <section className="mt-10">
          <Carousel
            header={(next, prev, isPrev, isNext) => (
              <CarouselHeader
                title="Newest Users"
                icon={
                  <FaDice className="text-primary text-5xl hidden lg:block" />
                }
                seeAll="/explore?sort=newest"
                description="Some newest profiles on DscInflux"
                next={next}
                prev={prev}
                isPrev={isPrev}
                isNext={isNext}
              />
            )}
            slides={newestUsers}
          >
            {(slides: Entity[]) =>
              slides.length > 0
                ? slides.map((entity) => (
                    <MiniCard
                      key={entity.id}
                      entity={entity}
                      isLiked={user ? entity.likes?.includes(user.id) : false}
                    />
                  ))
                : [<div key="no-users">No users found.</div>]
            }
          </Carousel>
        </section>

        {/* Random Users */}
        <section className="mt-10">
          <Carousel
            header={(next, prev, isPrev, isNext) => (
              <CarouselHeader
                title="Random Users"
                icon={
                  <FaDice className="text-primary text-5xl hidden lg:block" />
                }
                seeAll="/explore?sort=random"
                description="Some random profiles on DscInflux"
                next={next}
                prev={prev}
                isPrev={isPrev}
                isNext={isNext}
              />
            )}
            slides={randomUsers}
          >
            {(slides: Entity[]) =>
              slides.length > 0
                ? slides.map((entity) => (
                    <MiniCard
                      key={entity.id}
                      entity={entity}
                      isLiked={user ? entity.likes?.includes(user.id) : false}
                    />
                  ))
                : [<div key="no-users">No users found.</div>]
            }
          </Carousel>
        </section>
      </div>
    </div>
  );
};

export default HeroLayout;
