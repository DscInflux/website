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
        description="About Influx"
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
                text: "Learn about the history of Influx",
              },
            ]}
          />

          <ListWithHeader
            header="1. When? Why?"
            values={[
              {
                delimiter: "I. When:",
                text: "Discord Influx, created by Flooded in 2023, was shut down on May 7th. But Ranveer took over the site as he thought the concept was quite good and worked on to onward revive this site. It's great to see people who care about technology.",
              },
              {
                delimiter: "II. Why?",
                text: "The website is for creating profiles and finding new friends. Ranveer revived it after Flooded took it down, showing a passion for using tech to connect people.",
              },
            ]}
          />
          <LegalSectionWithLink
            title="2. Team"
            text="At the start of this project, only Flooded was working on it. However, the operation got shut down and since  Ranveer Soni became the Owner he also taken over the team. He appointed Toxic Dev and ZeroTwo36 as additional Co-Owners. You can check out more about them and other team members for yourself. At our"
            linkName="Teams Page"
            linkUrl="/team"
          />

          <ListWithHeaderAndLink
            header="Contact Us"
            values={[
              {
                delimiter: "•",
                text: "You can contact us via email: ",
                linkName: "hey@discordinflux.xyz",
                linkUrl: "mailto:hey@discordinflux.xyz",
              },
              {
                delimiter: "•",
                text: "You can also contact us in our: ",
                linkName: "Discord Server",
                linkUrl: "https://discord.gg/Jad6TcdEet",
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
