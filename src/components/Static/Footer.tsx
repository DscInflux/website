import Link from 'next/link';
import { FaGithub, FaDiscord } from 'react-icons/fa';
import React from 'react';

export default function Footer() {
  let items = [

    { label: 'Home', icon: 'fa fa-home', link: '/', external: false },
    { label: 'Explore', icon: 'fa fa-home', link: '/explore', external: false },
    { label: 'Partners', icon: 'fa fa-handshake', link: '/partners', external: false },
    { label: 'About Us', icon: 'fa fa-home', link: '/other/aboutus', external: false },
    { label: 'Credits', icon: 'fa fa-home', link: '/other/credits', external: false },
    { label: 'Terms Of Service', icon: 'fa fa-home', link: '/legal/tos', external: false },
    { label: 'Privacy', icon: 'fa fa-home', link: '/legal/privacy', external: false },

    { label: 'Documentation', icon: 'fa fa-home', link: 'https://docs.dscinflux.xyz', external: true },
    { label: 'Status', icon: 'fa fa-home', link: 'https://dscinflux.instatus.com', external: false },
    { label: 'Terms Of Service', icon: 'fa fa-home', link: '/legal/tos', external: false },

  ];

  let socialLinks = [
    { label: 'GitHub', icon: <FaGithub className="text-white hover:opacity-75" />, link: 'https://github.com/DscInflux/' },
    { label: 'Discord', icon: <FaDiscord className="text-white hover:opacity-75" />, link: 'https://discord.gg/RPCtG7Em8g' },
  ];

  // Function to sort items based on their original index
  const sortByIndex = (a, b) => {
    return items.findIndex(item => item.label === a.label) - items.findIndex(item => item.label === b.label);
  };

  items.sort(sortByIndex);
  socialLinks.sort(sortByIndex);

  return (
    <div className="w-full flex justify-center px-10 lg:px-12 mt-10">
      <footer className="max-w-7xl w-full py-6 pt-24">
        <div className="rounded-lg md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <Link href="/" legacyBehavior={true}>
              <div className="cursor-pointer col-span-2 flex items-center mr-6">
                <p className="pointer-events-none text-black dark:text-white font-semibold text-2xl">
                  Dsc<span className="text-primary"></span>‎ Influx
                </p>
              </div>
            </Link>
            <div className="flex space-x-4">
              {/* Social media links with added margin */}
              {socialLinks.map((socialLink, index) => (
                <a
                  key={index}
                  href={socialLink.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-8 h-8 bg-main-700 rounded-full mr-2"
                >
                  {socialLink.icon}
                  <span className="sr-only">{socialLink.label}</span>
                </a>
              ))}
              <a
                href="https://x.com/HeyInflux"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-8 h-8 bg-main-700 rounded-full mr-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                  <path
                    fill="currentColor"
                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                  />
                </svg>
                <span className="sr-only">X</span>
              </a>
            </div>
          </div>
          <p className="mt-5 font-semibold text-white">
            The best way to friend new friends.
          </p>
          <ul className="flex sm:flex-row flex-col mt-2 sm:mt-0 flex-wrap lg:items-center mb-6 gap-4 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
            {items.map((item, index) => (
              <li key={index}>
                {item.external ? (
                  <a
                    href={item.link}
                    className="relative font-medium hover:text-black hover:dark:text-white transition-all duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label} (External)
                  </a>
                ) : (
                  <Link href={item.link} key={index} legacyBehavior={true}>
                    <a className="relative font-medium hover:text-black hover:dark:text-white transition-all duration-200">
                      {item.label}
                    </a>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-4 flex flex-col lg:flex-row justify-between items-center pt-2 md:pt-4 lg:pt-6 border-t border-slate-850 mt-2 md:mt-4 lg:mt-6">
          <p className="text-slate-600 dark:text-zinc-400 font-medium">
            &copy; {new Date().getFullYear()} © DscInflux. All rights reserved. We are not affiliated with Discord.
          </p>
          <p className="text-slate-600 dark:text-zinc-400 font-medium">
            Powered with <span className="text-red-500">❤</span> by DscInflux &{' '}
            <a href="https://github.com/Infinity-Development" target="_blank" className="text-primary left">
              Infinity Development
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
