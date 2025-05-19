"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaFire, FaDice } from "react-icons/fa";

import Carousel from "@/components/global/Carousel";
import CarouselHeader from "@/components/global/CarouselHeader";
import MiniCard from "@/components/cards/UserCards";

import { Entity } from "@/types/entity/index";
import { User } from "@/types/users/index";

const Home: React.FC = () => {
  const router = useRouter();
  const [popularUsers, setPopularUsers] = useState<Entity[]>([]);
  const [randomUsers, setRandomUsers] = useState<Entity[]>([]);
  const [user, setUser] = useState<User | null>(null); // Set this from context or auth state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const popularRes = await fetch("/api/get/entity/all?sort=likes&limit=12");
        const popularData = await popularRes.json();

        const newestRes = await fetch("/api/get/entity/all?sort=newest&limit=12");
        const newestData = await newestRes.json();

        setPopularUsers(popularData?.data?.users || []);
        setRandomUsers(newestData?.data?.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = (e.currentTarget.username as HTMLInputElement).value.trim();
    if (username) {
      router.push(`/submit?url=${encodeURIComponent(username)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-10 3xl:px-0">
      <div className="max-w-7xl w-full">
        <div className="w-full flex items-center justify-center gap-36 py-24">
          <div className="lg:max-w-2xl w-full text-center">
            <h1 className="relative text-4xl lg:text-5xl text-black dark:text-white pb-2 leading-20 font-bold">
              Start <span className="text-primary">Finding</span> Friends{" "}
              <span className="hidden lg:absolute text-7xl opacity-5 left-0 right-0 top-0 bottom-0 text-primary z-[-1]">
                introducing
              </span>
            </h1>
            <p className="text-lg text-gray-500 mt-4 font-medium">
              Find & add new friends on Discord the easy way.
            </p>

            {user && user.appId ? (
              <div className="flex justify-center w-full mt-6">
                <Link href="/explore" legacyBehavior>
                  <a className="flex justify-center lg:justify-between items-center border !border-white/0 mt-4 lg:mt-0 w-2/4 lg:w-1/4 group h-[50px] rounded-full text-primary font-semibold hover:text-secondary transition-all duration-200">
                    <p className="lg:group-hover:translate-x-6 transition-all duration-200">
                      Explore
                    </p>
                    <FaArrowRight className="ml-6 lg:ml-2 lg:group-hover:translate-x-12 transition-all duration-200 lg:group-hover:opacity-0" />
                  </a>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="lg:flex items-center gap-1 mt-4">
                  <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full h-[50px]">
                    <span className="text-gray-500 select-none">DscInflux/</span>
                    <input
                      type="text"
                      name="username"
                      placeholder="RanveerSoni"
                      required
                      className="flex-grow ml-2 outline-none border-none bg-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-white rounded-md w-full lg:w-auto mt-4 lg:mt-0 px-8 h-[50px] font-semibold hover:bg-secondary transition-colors duration-200"
                  >
                    Find
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <section className="w-full mt-20">
          <Carousel
            header={(next, prev, isPrev, isNext) => (
              <CarouselHeader
                title="Popular Users"
                icon={<FaFire className="text-primary text-5xl hidden lg:block" />}
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
            {(data) => data.map((entity) => <MiniCard key={entity.id} entity={entity} />)}
          </Carousel>
        </section>

        <section className="w-full mt-10">
          <Carousel
            header={(next, prev, isPrev, isNext) => (
              <CarouselHeader
                title="Newest Users"
                icon={<FaDice className="text-primary text-5xl hidden lg:block" />}
                seeAll="/explore?sort=newest"
                description="Some random profiles on DscInflux"
                next={next}
                prev={prev}
                isPrev={isPrev}
                isNext={isNext}
              />
            )}
            slides={randomUsers}
          >
            {(data) => data.map((entity) => <MiniCard key={entity.id} entity={entity} />)}
          </Carousel>
        </section>
      </div>
    </div>
  );
};

export default Home;
