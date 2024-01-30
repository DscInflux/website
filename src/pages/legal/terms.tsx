import React from "react";
import { NextSeo } from "next-seo";

export default function TOS({ isLoggedIn }) {
  return (
    <>
      <style jsx>
        {`
          p {
            font-size: 1.125rem; /* 18px */
            line-height: 1.75rem; /* 28px */
            margin-top: 0.25rem; /* 4px */
          }
          .subtitle {
            font-size: 1.25rem; /* 20px */
            line-height: 1.75rem; /* 28px */
          }
          h1 {
            margin-top: 1.5rem; /* 24px */
            font-size: 1.875rem; /* 30px */
            line-height: 2.25rem; /* 36px */
          }
          strong {
            color: #0ea5e9;
          }
          h2 {
            margin-top: 1rem; /* 16px */
            font-size: 1.5rem; /* 24px */
            line-height: 2rem; /* 32px */
            color: rgba(255, 255, 255, 0.9);
          }
          ul {
            background: rgba(17, 24, 39, 0.5);
            border-radius: 10px;
            padding: 20px;
          }
          h3 {
            margin-top: 1rem; /* 16px */
            font-size: 1.3rem; /* 24px */
            line-height: 2rem; /* 32px */
            color: rgba(255, 255, 255, 0.7);
          }
        `}
      </style>
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
      <div className="p-5 lg:p-10 py-[10rem] lg:py-[12rem] center rounded-lg min-h-screen">
        <h1
          className="italic text-sky-600 text-7xl font-bold"
          style={{ fontSize: "4.5rem", lineHeight: "1" }}
        >
          Terms Of Service
        </h1>
        <p className="text-white/50 text-sm pl-6 mt-7 center mb-7 text-left font-semibold">
          Last updated: August 05, 2023
        </p>
        <p className="text-lg">
          • Terms of service (ToS) are a sort of document that specifies what a
          service provider is liable for as well as user duties that must be met
          in order for the service to continue. Users who violate the terms of
          service are subject to termination. Many websites and applications
          make their terms of service available.
        </p>
        <br />

        <p>1. Using Our Websites</p>
        <ul>
          <li>
            <p>
              <strong>•</strong>This website is for Normal Users who want to List there profiles Search our vast list of profiles for an exciting start to your FriendShip. Filter by name, category, tags and description to find a user that you match!.
            </p>
          </li>
          <li>
            <p>
              <strong>•</strong> Upon adding content to the website, the following user-provided information is saved: profile picture, user ID, username, and optionally, email (based on user preference) and occupation. It's important to note that all of this data originates from the user, and the website does not autonomously collect any of this information.
            </p>
          </li>
          <li>
            <p>
              <strong>•</strong>  Your data is retained when you publish content on our platform. However, if you don't have any content or choose to delete it, our automated system will automatically remove all associated information. There's no need for alarm, as the collected information serves security purposes and is also used for scheduled future backups.
            </p>
          </li>
        </ul>
        <h1>2. Location Information</h1>
        <p>
        We gather login location and geolocation data to monitor visitor counts by country. This information is securely stored on our private servers, and we prioritize its safety. Please be assured that location data is not publicly visible; it is mainly utilized for administrative analytics and statistical purposes.
        </p>
        <h1>3.Location of your Data</h1>
        <p>
          All saved information is in our database, and the only people who have
          access to it are the owner of the bot list and anybody else who has
          given them permission. We save your information so that we can
          identify you when you need assistance with the bot or server.
        </p>

        <h1>Νo excuses</h1>
        <p>Our commitment to transparency is evident through our regular official announcements and comprehensive information sharing. It's crucial that as a user, you acquaint yourself with the aforementioned details. Importantly, any violation of our Terms of Service will be met with due consequences, emphasizing the significance of compliance. We take pride in maintaining a secure environment where breach of trust is not tolerated. Thus, understanding and adhering to our guidelines is paramount. This approach ensures that our platform remains a safe space for everyone, and deviations from the set standards will be addressed accordingly.</p>

        <h1>Contact Us</h1>
        <p>
          If you have any questions about this Terms, You can contact
          us at:
        </p>
        <ul>
          <li>email: legal@dscinflux.xyz</li>
          <li>You can also contact us in our: Discord Server (https://discord.gg/RPCtG7Em8g)</li>
        </ul>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      isLoggedIn: context.req.cookies.token ? true : false,
    },
  };
}