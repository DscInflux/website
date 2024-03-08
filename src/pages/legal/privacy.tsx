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
        title="Privacy Policy"
        description="View and stay up-to date with our privacy policy."
        openGraph={{
          images: [
            {
              url: `https://cdn.dscinflux.xyz/assets/png/influx.png`,
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
      <div className="p-5 lg:p-10 py-[10rem] lg:py-[12rem] rounded-lg min-h-screen">
        <h1
          className="italic text-sky-600 text-7xl font-bold"
          style={{ fontSize: "4.5rem", lineHeight: "1" }}
        >
          Privacy Policy
        </h1>
        <p className="text-white/50 text-sm pl-6 mt-7 mb-7 text-left font-semibold">
        Last updated: August 05, 2023</p>
        <p className="text-lg">
          • Our data is handled with the highest level of confidentiality and security. When you authenticate or interact with our services, rest assured that your personal information remains entirely private and protected. Every individual is assigned a distinct and exclusive ID, which empowers us to closely monitor processes and offer assistance whenever necessary. As you engage with our services, data is seamlessly collected to enhance your experience. Crucially, when you decide to discontinue using our offerings, rest assured that this data is swiftly and automatically purged, guaranteeing your privacy at all times.
        </p>
        <br />

  
        <p>Information that we collect</p>
        <ul>
          <li>
            <p>
              <strong>•</strong> All submitted information is stored in our database and will never be accessed without your permission.
            </p>
          </li>
          <li>
            <p>
              <strong>•</strong> If you contact us directly, we require additional information about you to improve youre profile such as your name, date of birth, email address, location etc.
            </p>
          </li>
          <li>
            <p>
              <strong>•</strong> User accounts are created using publicly accessible information provided through the Discord API and Authentication Services.
            </p>
          </li>
        </ul>
        <p>Information that we collect</p>
        <p>We use the information we collect in various ways, including to:</p>
        <ul>
          <li>
            <p>
              <strong>•</strong> Provide, operate, and maintain our website.
            </p>
          </li>
          <li>
            <p>
              <strong>•</strong> Improve, personalize, and expand our website.
            </p>
          </li>
          <li>
            <p>
              <strong>•</strong>Understand and analyze how you use our website.
            </p>
          </li>
          <li>
            <p>
              <strong>•</strong>Imporve your Bot's page. That include
              marketing/promoting it.
            </p>
          </li>
          <li>
            <p>
              <strong>•</strong>Communicate with you, either directly or through
              one of our partners.
            </p>
          </li>
        </ul>
        <h1>Cookies and Web Beacons</h1>
        <p>
        Similar to most websites, Discord Influx employs 'cookies' to store data such as visitor preferences and accessed pages. These cookies facilitate a personalized user experience by tailoring web page content to factors like the visitor's browser type and preferences.
        </p>
        <h1>Advertising Partners</h1>
        <p>
        Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on our website which are sent directly to the users' browser. They will automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit. Note that Discord Influx has no access to or control over these cookies that are used by third-party advertisers
        </p>
        <h1>Location of your Data</h1>
        <p>
        All saved information is in our database, and the only people who have access to it are the owner of the profile list and anybody else who has given them permission. We save your information so that we can identify you when you need assistance with the bot or server.
        </p>
        <h1>Security</h1>
        <p>
        DiscordInflux takes reasonable precautions to safeguard your information against unauthorized access, loss, misuse, or modification by third parties. Although we make good faith attempts to maintain information gathered on the Service in a secure operating environment that is not accessible to the public, we cannot guarantee the total security of that information during transmission or storage on our systems. Furthermore, while we make every effort to preserve the integrity and security of our network and systems, we cannot guarantee that our security measures will prevent third-party hackers from illegally accessing this information..
        </p>
        <h1>Children's Information</h1>
        <p>
        Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. Discord Influx does not knowingly collect any Personal Identifiable Information from children under the age of 13.
        </p>
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