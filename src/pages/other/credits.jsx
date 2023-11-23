import CreditsCard from "@/components/Layout/Other/CreditLayout";

import { useRouter } from "next/router";
import React, { useState, useRef } from "react";

const getRandomColor = () => {
  const colors = [
    "bg-gradient-neon-red",
    "bg-gradient-neon-blue",
    "bg-gradient-neon-green",
    "bg-gradient-neon-purple",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function Credits() {
  const router = useRouter();
  const [bannerOpen, setBannerOpen] = useState(true);
  const [enterLoading, setEnterLoading] = useState(false);
  const mainButton = useRef(null);

  const customBackground = getRandomColor();

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="mt-2 text-4xl font-bold leading-tight tracking-tight text-cyber-cyan sm:text-5xl">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent text-7xl text-center">
              Credits
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-neon-blue lg:mx-auto">
            <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text ">
              We value the people who helped in making of Influx and appreciate
              their support.
            </span>
          </p>
        </div>
        <div className="mt-32 sm:mt-40 md:mt-40 lg:mt-48">
          <div className="space-y-10 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10 md:space-y-0">
            <CreditsCard
              title="CordX"
              logo="https://beta.cordx.lol/assets/logo.png"
              banner="https://pbs.twimg.com/profile_banners/1602095201526640640/1691815511/1500x500"
              owner=" therealtoxicdev"
              ownerlink="https://discord.com/users/510065483693817867"
              desc="Simplifying the way you share your online media, files and links with your friends, family and loved ones."
              link1="https://x.com/HeyCordX"
              link2="https://beta.cordx.lol/"
              link1Title="X"
              link2Title="Website"
              link1Icon="fab fa-twitter"
              link2Icon="fa fa-globe"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async function (ctx) {
  return { props: {} };
};
