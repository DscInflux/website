import Link from "next/link";
import { FaGithub, FaDiscord, FaExternalLinkAlt } from "react-icons/fa";
import { SiX } from "react-icons/si";
import React from "react";

export default function Footer() {
  const items = [
    { label: "Home", link: "/", external: false },
    { label: "Explore", link: "/explore", external: false },
    { label: "Stats", link: "/stats", external: false },
    {
      label: "Terms Of Service",
      link: "https://purrquinox.com/terms",
      external: true,
    },
    {
      label: "Privacy Policy",
      link: "https://purrquinox.com/privacy",
      external: true,
    },
    {
      label: "Cookie Policy",
      link: "https://purrquinox.com/cookies",
      external: true,
    },
    { label: "Status", link: "https://status.purrquinox.com/", external: true },
  ];

  const socialLinks = [
    {
      label: "GitHub",
      icon: <FaGithub />,
      link: "https://github.com/DscInflux/",
    },
    {
      label: "Discord",
      icon: <FaDiscord />,
      link: "https://discord.gg/RPCtG7Em8g",
    },
    { label: "X", icon: <SiX />, link: "https://x.com/HeyDscInflux" },
  ];

  return (
    <div className="w-full flex justify-center px-6 sm:px-10 lg:px-12 mt-20 font-jakarta">
      <footer className="w-full max-w-7xl text-white">
        <div className="w-full border-t border-zinc-800 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <Link href="/" legacyBehavior>
              <a className="text-2xl font-bold tracking-tight text-white hover:text-primary transition">
                DscInflux
                <span className="block text-sm font-normal text-zinc-400">
                  by Purrquinox
                </span>
              </a>
            </Link>

            <div className="flex space-x-3">
              {socialLinks.map(({ label, icon, link }, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-primary text-white hover:text-white transition duration-200"
                  title={label}
                >
                  {icon}
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>

          <ul className="flex flex-wrap gap-4 text-sm text-zinc-400 font-medium mb-8">
            {items.map(({ label, link, external }, index) => (
              <li key={index}>
                {external ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition flex items-center gap-1"
                  >
                    {label}
                    <FaExternalLinkAlt className="inline-block text-xs" />
                  </a>
                ) : (
                  <Link href={link} legacyBehavior>
                    <a className="hover:text-white transition">{label}</a>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="text-sm text-zinc-500 border-t border-zinc-800 pt-6 text-center">
            &copy; {new Date().getFullYear()} Purrquinox. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
