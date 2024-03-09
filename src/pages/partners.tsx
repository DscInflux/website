import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import PartnerCard from "@/components/Layout/Partner/PartnerLayout";

export default function Partners() {
  const router = useRouter();
  const [partners, setPartners] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/partner`)
      .then(response => response.json())
      .then(data => setPartners(data))
      .catch(error => console.error("Error fetching partners:", error));
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center px-10 3xl:px-0">
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
              {partners.map(partner => (
                <PartnerCard
                  key={partner.title}
                  title={partner.title}
                  logo={partner.logo}
                  banner={partner.banner}
                  owner={partner.ownername}
                  ownerlink={partner.ownerid}
                  desc={partner.desc}
                  link1={partner.link1}
                  link2={partner.link2}
                  link1Title={partner.link1title}
                  link2Title={partner.link2title}
                  link1Icon={partner.link1icon}
                  link2Icon={partner.link2icon}
                />
              ))}
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
