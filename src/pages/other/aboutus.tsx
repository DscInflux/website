import React from "react";
import Layout from "@/components/Layout/Legal/Legal";
import { NextSeo } from "next-seo";
import {
  ListWithoutHeader,
  ListWithHeader,
  ListWithHeaderAndLink,
} from "@/components/Layout/Legal/Lists";
import {
  LegalSectionBase,
  LegalSectionWithLink,
} from "@/components/Layout/Legal/Section";

export default function Privacy() {
  return (
    <>
      <NextSeo
        title="About"
        description="About DscInflux"
        openGraph={{
          images: [
            {
              url: `https://cdn.topiclist.xyz/images/png/DiscordInflux_logo.png`,
              width: 800,
              height: 600,
              alt: "Influx Logo",
            },
          ],
        }}
        twitter={{
          cardType: "summary",
        }}
      />
      <Layout>
        <div className="p-5 lg:p-10 pt-[10rem] lg:pt-[12rem] pb-0 lg:pb-[12rem] rounded-lg min-h-screen">
          <h1
            className="italic bg-gradient-to-r from-blue-600 via-pink-700 to-blue-600 bg-clip-text text-transparent text-11xl font-bold text-center"
            style={{ fontSize: "6rem", lineHeight: "1" }}
          >
            About Us
          </h1>

          <ListWithoutHeader
            values={[
              {
                delimiter: "•",
                text: "Here is some history on DscInflux or known as Discord Influx.",
              },
            ]}
          />

          <ListWithHeader
            header="When? Why?"
            values={[
              {
                delimiter: "I. When:",
                text: "Discord Influx well now known as DscInflux was created by Flooded in 2023 since then this was closed down in May 2023. Since then ranveersoni took over this project and now connor200024 is the owner of it.",
              },
              {
                delimiter: "II. Why?",
                text: "We have made this new website and ui for you all to create profiles to find new friends. This is sorta like JobCord another website where you can hire Moderators & Developers. Check them out: https://jobcord.co",
              },
            ]}
          />
          <LegalSectionWithLink
            title="Team"
            text="When this was opened before it was only Flooded working on this but now we have a full development team working on this project. Feel free to check our staff team page."
            linkName="Teams Page"
            linkUrl="/team"
          />

          <ListWithHeaderAndLink
            header="Contact Us"
            values={[
              {
                delimiter: "•",
                text: "You can contact us via email: ",
                linkName: "hey@dscinflux.xyz",
                linkUrl: "mailto:hey@dscinflux.xyz",
              },
              {
                delimiter: "•",
                text: "You can also contact us in our: ",
                linkName: "Discord Server",
                linkUrl: "https://discord.gg/RPCtG7Em8g",
              },
            ]}
          />
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async function (ctx) {
  return { props: {} };
};
