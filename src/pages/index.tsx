import React from "react";
import Button from "@/components/Global/Button";
import MiniCard from "@/components/Global/Cards/Mini";
import Input from "@/components/Global/Input";
import Carousel from "@/components/Global/Carousel";
import CarouselHeader from "@/components/Global/CarouselHeader";
import { request } from "@/utils/apiHandler";
import withSession from "@/libraries/withSession";
import { useRouter } from "next/router";
import { useUser } from "@/context/user";
import Link from "next/link";


interface User {
  appId: string;
}

interface Entity {
  avatar: string;
  banner: string;
  url: string;
  discord: {
    username: string;
  };
  isLiked: boolean;
  about: string;
  isVerified: boolean;
}

interface HomeProps {
  popularUsers: Entity[];
  randomUsers: Entity[];
}

const Home: React.FC<HomeProps> = ({ popularUsers, randomUsers }) => {
  const router = useRouter();
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(
      "/submit?url=" + encodeURIComponent((e.target as HTMLFormElement).username.value)
    );
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center px-10 3xl:px-0">
        <div className="max-w-7xl w-full">
          <div className="w-full flex items-center justify-center gap-36 py-24">
            <div className="lg:max-w-2xl w-full text-center">
              <h1 className="relative text-4xl lg:text-5xl text-black dark:text-white pb-2 leading-20 font-bold">
                Start <span className="text-primary">Finding</span> Friends
                <span className="hidden lg:absolute text-7xl opacity-5 left-0 right-0 top-0 bottom-0 text-primary z-[-1]">
                  introducing
                </span>
              </h1>
              <p className="text-lg text-gray-500 mt-4 font-medium">
                Find & add new friends on Discord the easy way.
              </p>
              {user && user.appId ? (
                <div className="flex justify-center w-full mt-6">
                  <Link href="/explore" legacyBehavior={true}>
                    <Button
                      variant="ghost"
                      className="flex justify-center lg:justify-between items-center border !border-white/0 mt-4 lg:mt-0 w-2/4 lg:w-1/4 group h-[50px] rounded-full"
                    >
                      <p className="lg:group-hover:translate-x-6 transition-all duration-200">
                        Explore
                      </p>
                      <i className="fas fa-arrow-right ml-6 lg:ml-2 lg:group-hover:translate-x-12 transition-all duration-200 lg:group-hover:opacity-0" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="lg:flex items-center gap-1 mt-4">
                    <Input
                      placeholder={"Connor200024"}
                      leftContent={
                        <p className="text-gray-500 pt-1">DscInflux/</p>
                      }
                      className="px-1 py-1 w-full h-[50px]"
                      name="username"
                    />
                    <Button
                      variant="default"
                      className="border !border-white/0 w-full lg:w-auto mt-4 lg:mt-0 px-8 h-[50px]"
                    >
                      Find
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="w-full mt-20">
            <Carousel
              header={(next, prev, isPrev, isNext) => (
                <CarouselHeader
                  title="Popular Users"
                  icon="fa fa-fire"
                  seeAll="/explore?sort=likes"
                  description="The most popular profiles on DscInflux"
                  next={next}
                  prev={prev}
                  isPrev={isPrev}
                  isNext={isNext}
                />
              )}
              slides={popularUsers || []}
            >
              {(data, index) =>
                data.map((entity, index) => (
                  <MiniCard
                    key={index}
                    image={entity.avatar}
                    banner={entity.banner}
                    url={entity.url}
                    username={entity.discord.username}
                    isLiked={entity.isLiked}
                    about={entity.about}
                    isVerified={entity.isVerified}
                  />
                ))
              }
            </Carousel>
            <div className="w-full mt-10">
            <Carousel
              header={(next, prev, isPrev, isNext) => (
                <CarouselHeader
                  title="Newest Users"
                  icon="fa fa-dice"
                  seeAll="/explore?sort=newest"
                  description="Some random profiles on DscInflux"
                  next={next}
                  prev={prev}
                  isPrev={isPrev}
                  isNext={isNext}
                />
              )}
              slides={randomUsers || []}
            >
              {(data, index) =>
                data.map((entity, index) => (
                  <MiniCard
                    key={index}
                    image={entity.avatar}
                    banner={entity.banner}
                    url={entity.url}
                    username={entity.discord.username}
                    isLiked={entity.isLiked}
                    about={entity.about}
                    isVerified={entity.isVerified}
                  />
                ))
              }
            </Carousel>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = withSession(async (ctx: any) => {
  try {
    const popularUsersRequest = await request(
      "/entities?sort=likes&limit=12",
      "GET",
      null,
      ctx.req.session.get("access_token")
    );
    const newestUsersReqest = await request(
      "/entities?sort=newest",
      "GET",
      null,
      ctx.req.session.get("access_token")
    );
    return {
      props: {
        popularUsers: popularUsersRequest?.data?.users || [],
        randomUsers: newestUsersReqest?.data.users || [],
      },
    };
  } catch (e) {
    return {
      props: {
        popularUsers: [],
        randomUsers:[],
      },
    };
  }
});

export default Home;
