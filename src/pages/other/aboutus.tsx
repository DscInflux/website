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
        title="About Us"
        description="here is where you will get all of what we do and how we came to be."
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
          className="italic text-sky-600 text-7xl center font-bold"
          style={{ fontSize: "4.5rem", lineHeight: "1" }}
        >
About Us        
</h1>
        <p className="text-lg">
          • here is some history on DscInflux or known as Discord Influx.
        </p>
        <br />

  
        <p>When? Why?</p>
        <ul>
          <li>
            <p>
              <strong>I When:</strong> Discord Influx well now known as DscInflux was created by Flooded in 2023 since then this was closed down in May 2023. Since then Ranveer Soni took over this project and now connor200024 is the owner of it.
            </p>
          </li>
          <li>
            <p>
              <strong>II Why:</strong>We have made this new website and ui for you all to create profiles to find new friends.
            </p>
          </li>
        </ul>
        <h1>Team</h1>
        <p>
        When this was opened before it was only Flooded working on this but now we have a full development team working on this project. Feel free to check our staff team page. Teams Page. (https://dscinflux.xyz/team)
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