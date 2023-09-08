import React from "react";
import {
  FaGithub,
  FaDiscord,
  FaCogs,
  FaCompass,
  FaUserCircle,
  FaSignInAlt,
  FaGavel,
  FaHammer,
  FaUsers,
  FaHandshake,
  FaBook,
} from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-15 md:mt-20">
      <footer className="bg-main-800" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="py-6 px-3 mx-auto max-w-7xl sm:px-5 lg:py-14 lg:px-9">
          <div className="xl:grid xl:grid-cols-3 xl:gap-6">
            <div className="space-y-5 xl:col-span-1">
              <span>
                <img
                  src="https://cdn.topiclist.xyz/images/png/DiscordInflux_logo.png"
                  style={{ width: "100px", height: "100px" }}
                  className="favicon w-58 h-58 transform:rotate(360deg)"
                  draggable={false}
                  alt="Influx Logo"
                />
              </span>
              <p className="text-white">The best way to friend new friends.</p>
              <div className="flex space-x-4">
                {/* Social media links */}
                <a
                  href="https://x.com/HeyInflux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-8 h-8 bg-main-700 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                    />
                  </svg>
                  <span className="sr-only">X</span>
                </a>
                <a
                  href="https://github.com/DscInflux/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-8 h-8 bg-main-700 rounded-full"
                >
                  <FaGithub className="text-white hover:opacity-75" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href="https://discord.gg/RPCtG7Em8g"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-8 h-8 bg-main-700 rounded-full"
                >
                  <FaDiscord className="text-white hover:opacity-75" />
                  <span className="sr-only">Discord</span>
                </a>
                
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-12 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
                    Info
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link href={"/explore"}>
                        <a className="text-white hover:text-red-500 flex items-center">
                          <FaCompass className="mr-2" />
                          Explore
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={"/other/aboutus"}>
                        <a className="text-white hover:text-red-500 flex items-center">
                          <FaCompass className="mr-2" />
                          About Us
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={"/other/credits"}>
                        <a className="text-white hover:text-red-500 flex items-center">
                          <FaCompass className="mr-2" />
                          Credits
                        </a>
                      </Link>
                    </li>
                    
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
                    Profile
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link href={"/profile"}>
                        <a className="text-white hover:text-red-500 flex items-center">
                          <FaUserCircle className="mr-2" />
                          Profile
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={"https://discordinflux.xyz/v1/auth/callback"}
                      >
                        <a className="text-white hover:text-red-500 flex items-center">
                          <FaSignInAlt className="mr-2" />
                          Login
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
                   Support
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link href={"https://discord.gg/RPCtG7Em8g"}>
                        <a className="text-white hover:text-red-500 flex items-center">
                          <FaDiscord className="mr-2" />
                          Discord
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
                   Policies
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link href={"/legal/privacy"}>
                        <a className="text-white hover:text-red-500 flex items-center">
                          <FaGavel className="mr-2" />
                          Privacy Policy
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href={"/legal/terms"}>
                        <a className="text-white hover:text-red-500 flex items-center">
                          <FaHammer className="mr-2" />
                          Terms of Services
                        </a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
                   Other
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href={"/partners"}>
                      <a className="text-white hover:text-red-500 flex items-center">
                        <FaHandshake className="mr-2" />
                        Partners
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={"/team"}>
                      <a className="text-white hover:text-red-500 flex items-center">
                        <FaUsers className="mr-2" />
                        Teams
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href={"/status"}>
                      <a className="text-white hover:text-red-500 flex items-center">
                        <FaCogs className="mr-2" />
                        Staus
                      </a>
                    </Link>
                  </li>
                  
                  
                  <li>
                    <Link href={"https://docs.discordinflux.xyz"}>
                      <a className="text-white hover:text-red-500 flex items-center">
                        <FaBook className="mr-2" />
                        Documentation
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 mt-12 border-t border-slate-850">
            <p className="mt-4 font-semibold text-center text-white">
              © {currentYear} DscInflux. All rights reserved. We are not
              affiliated with Discord.
            </p>
            <p className="mt-4 font-semibold text-right text-white">
              Powered with <span className="text-pink-500">❤</span> by{" "}
              <a>DscInflux & </a>
              <a
                href="https://github.com/Infinity-Development"
                target="_blank"
                className="text-primary"
              >
                Infinity Development
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
