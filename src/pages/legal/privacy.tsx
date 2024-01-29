import React from "react";
import Layout from "@/components/Layout/Legal/Legal";
import { NextSeo } from "next-seo";
import {
  ListWithoutHeader,
  ListWithHeader,
  ListWithHeaderAndSubtitle,
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
        title="Privacy Policy"
        description="View and stay up-to date with our privacy policy."
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
            Privacy Policy
          </h1>

          <p className="text-white/50 text-sm pl-6 mt-7 mb-7 text-center font-semibold">
            Last updated: August 05, 2023
          </p>

          <ListWithoutHeader
            values={[
              {
                delimiter: "•",
                text: "Our data is handled with the highest level of confidentiality and security. When you authenticate or interact with our services, rest assured that your personal information remains entirely private and protected. Every individual is assigned a distinct and exclusive ID, which empowers us to closely monitor processes and offer assistance whenever necessary. As you engage with our services, data is seamlessly collected to enhance your experience. Crucially, when you decide to discontinue using our offerings, rest assured that this data is swiftly and automatically purged, guaranteeing your privacy at all times.",
              },
            ]}
          />

          <LegalSectionWithLink
            title="Your Consent"
            text="By using our website you are agreeing to the then current version of this Privacy Policy & our"
            linkName="Terms of Service"
            linkUrl="/legal/terms"
          />

          <ListWithHeader
            header="Information that we collect"
            values={[
              {
                delimiter: "1.",
                text: "All submitted information is stored in our database and will never be accessed without your permission.",
              },
              {
                delimiter: "2.",
                text: "If you contact us directly, we require additional information about you to improve youre profile such as your name, date of birth, email address, location etc.",
              },
              {
                delimiter: "3.",
                text: "User accounts are created using publicly accessible information provided through the Discord API and Authentication Services.",
              },
            ]}
          />

          <ListWithHeaderAndSubtitle
            header="How we use your information"
            subtitle="We use the information we collect in various ways, including to:"
            values={[
              {
                delimiter: ">",
                text: "Provide, operate, and maintain our website.",
              },
              {
                delimiter: ">",
                text: "Improve, personalize, and expand our website.",
              },
              {
                delimiter: ">",
                text: "Understand and analyze how you use our website.",
              },
              {
                delimiter: ">",
                text: "Improve youre Own profile page",
              },
              {
                delimiter: ">",
                text: "Communicate with you, either directly or through one of our partners.",
              },
            ]}
          />

          <LegalSectionBase
            title="Cookies and Web Beacons"
            text="Similar to most websites, Discord Influx employs 'cookies' to store data such as visitor preferences and accessed pages. These cookies facilitate a personalized user experience by tailoring web page content to factors like the visitor's browser type and preferences."
          />

          <LegalSectionBase
            title="Advertising Partners"
            text="Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements 
             and links that appear on our website which are sent directly to the users' browser. They will automatically receive your IP address when this occurs. These technologies 
             are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit. 
             Note that Discord Influx has no access to or control over these cookies that are used by third-party advertisers"
          />

          <LegalSectionBase
            title="Location of your Data"
            text="All saved information is in our database, and the only people who have access to it are the owner of the profile list and anybody else who has given them permission. We save your information so that we can identify you when you need assistance with the bot or server."
          />

          <LegalSectionBase
            title="Security"
            text="dscinflux takes reasonable precautions to safeguard your information against unauthorized access, loss, misuse, or modification by third parties. Although we make good faith attempts to maintain information gathered on the Service in a secure operating environment that is not accessible to the public, we cannot guarantee the total security of that information during transmission or storage on our systems. Furthermore, while we make every effort to preserve the integrity and security of our network and systems, we cannot guarantee that our security measures will prevent third-party hackers from illegally accessing this information.."
          />

          <LegalSectionBase
            title="Children's Information"
            text="Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, 
             and/or monitor and guide their online activity. Discord Influx does not knowingly collect any Personal Identifiable Information from children under the age of 13."
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
                linkUrl: "https://discord.gg/dscinflux",
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
