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
        title="Terms"
        description="View and stay up-to date with our terms."
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
            className="italic bg-gradient-to-r from-blue-600 via-pink-700 to-blue-600 bg-clip-text text-transparent text-7xl font-bold text-center"
            style={{ fontSize: "5.5rem", lineHeight: "1" }}
          >
            Terms Of Services
          </h1>

          <p className="text-white/50 text-sm pl-6 mt-7 mb-7 text-center font-semibold">
            Last updated: August 05, 2023
          </p>

          <ListWithoutHeader
            values={[
              {
                delimiter: "•",
                text: "Terms of service (ToS) are a sort of document that specifies what a service provider is liable for as well as user duties that must be met in order for the service to continue. Users who violate the terms of service are subject to termination. Many websites and applications make their terms of service available.",
              },
            ]}
          />

          <LegalSectionWithLink
            title="Your Consent"
            text="By using our website you are agreeing to the then current version of this Terms & our"
            linkName="Privacy Policy"
            linkUrl="/legal/privacy"
          />

          <ListWithHeader
            header="1. Using Our Website"
            values={[
              {
                delimiter: "1.",
                text: "This website is for Normal Users who want to List there profiles Search our vast list of profiles for an exciting start to your FriendShip. Filter by name, category, tags and description to find a user that you match!.",
              },
              {
                delimiter: "2.",
                text: "Upon adding content to the website, the following user-provided information is saved: profile picture, user ID, username, and optionally, email (based on user preference) and occupation. It's important to note that all of this data originates from the user, and the website does not autonomously collect any of this information.",
              },
              {
                delimiter: "3.",
                text: "Your data is retained when you publish content on our platform. However, if you don't have any content or choose to delete it, our automated system will automatically remove all associated information. There's no need for alarm, as the collected information serves security purposes and is also used for scheduled future backups.",
              },
            ]}
          />

          <LegalSectionBase
            title="Location Information"
            text="We gather login location and geolocation data to monitor visitor counts by country. This information is securely stored on our private servers, and we prioritize its safety. Please be assured that location data is not publicly visible; it is mainly utilized for administrative analytics and statistical purposes."
          />

          <LegalSectionBase
            title="Location of your Data"
            text="All saved information is in our database, and the only people who have access to it are the owner of the profile list and anybody else who has given them permission. We save your information so that we can identify you when you need assistance with the bot or server."
          />

          <LegalSectionBase
            title="Νo excuses"
            text="Our commitment to transparency is evident through our regular official announcements and comprehensive information sharing. It's crucial that as a user, you acquaint yourself with the aforementioned details. Importantly, any violation of our Terms of Service will be met with due consequences, emphasizing the significance of compliance.

                        We take pride in maintaining a secure environment where breach of trust is not tolerated. Thus, understanding and adhering to our guidelines is paramount. This approach ensures that our platform remains a safe space for everyone, and deviations from the set standards will be addressed accordingly."
          />

          <ListWithHeaderAndLink
            header="Contact Us"
            values={[
              {
                delimiter: "•",
                text: "You can contact us via email: ",
                linkName: "legal@dscinflux.xyz",
                linkUrl: "mailto:legal@dscinflux.xyz",
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
