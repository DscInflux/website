import { useRouter } from "next/router";
import React, { useState, useRef } from "react";
import PartnerCard from "@/components/Layout/Partner/PartnerLayout";

const getRandomColor = () => {
  const colors = [
    "bg-gradient-neon-red",
    "bg-gradient-neon-blue",
    "bg-gradient-neon-green",
    "bg-gradient-neon-purple",
    // Add more neon colors as needed
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function Partners() {
  const router = useRouter();
  const [bannerOpen, setBannerOpen] = useState(true);
  const [enterLoading, setEnterLoading] = useState(false);
  const mainButton = useRef(null);

  const customBackground = getRandomColor();

  return (
    <>
      <div className="flex flex-col items-center justify-center px-10 3xl:px-0">
        <div className="lg:text-center">
        <div className="max-w-7xl w-full">
          <div className="w-full mt-5">
            <div className="flex items-center gap-5">
              <div className="hidden lg:block relative">
                <i className="fa fa-users hidden lg:block text-5xl text-primary" />
              </div>
              <div>
                <h1 className="text-lg lg:text-3xl text-transparent bg-clip-text bg-gradient-to-tr from-primary to-secondary font-extrabold">
                  Our Partners
                </h1>
                <p
                  className={`text-sm lg:text-base text-gray-700 $["bold-text"]}`}
                >
                  Check out our partners who support DscInflux
                </p>
              </div>
            </div>
          </div>
        <div className="mt-32 sm:mt-40 md:mt-40 lg:mt-48">
          <div className="space-y-10 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10 md:space-y-0">
            <PartnerCard
              title="Topic Bot List"
              logo="https://media.discordapp.net/attachments/922329669884342302/927144475397087242/aa531606-a037-4e5a-b184-c28624e1e116_static.png?width=128&height=128"
              banner="https://pbs.twimg.com/profile_banners/1505194289323823105/1678624541/1500x500"
              owner=" RanveerSoni"
              ownerlink="https://discord.com/users/787241442770419722"
              desc="Do you want to expand and improve your Discord bot? We are here for you!"
              link1="https://x.com/topicbotlist"
              link2="https://topiclist.xyz/"
              link1Title="X"
              link2Title="Website"
              link1Icon="fab fa-twitter"
              link2Icon="fa fa-globe"
            />
            <PartnerCard
              title="CordX"
              logo="https://beta.cordx.lol/assets/logo.png"
              banner="https://beta.cordx.lol/assets/banner.png"
              owner=" TheRealToxicDev"
              ownerlink="https://discord.com/users/510065483693817867"
              desc="Do you want to expand and improve your Discord bot? We are here for you!"
              link1="https://x.com/HeyCordX"
              link2="https://beta.cordx.lol"
              link1Title="X"
              link2Title="Website"
              link1Icon="fab fa-twitter"
              link2Icon="fa fa-globe"
            />
          </div>
        </div>
      </div>
      </div>
      </div>
    </>
  );
}

export const getServerSideProps = async function (ctx) {
  return { props: {} };
};
