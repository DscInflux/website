"use client";

import React, { useState } from "react";
import {
  FaHome,
  FaCompass,
  FaHandshake,
  FaUsers,
  FaCogs,
  FaBars,
  FaUser,
  FaDiscord,
} from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSelector from "./ThemeSwitcher";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const items = [
    { label: "Home", icon: <FaHome />, link: "/" },
    { label: "Explore", icon: <FaCompass />, link: "/explore" },
    { label: "Partners", icon: <FaHandshake />, link: "/partners" },
    { label: "Team", icon: <FaUsers />, link: "/team" },
    { label: "Discord", icon: <FaCogs />, link: "https://discord.gg/RPCtG7Em8g", external: true },
  ];

  const handleLogin = () => signIn("discord", { callbackUrl: pathname });
  const handleLogout = () => signOut();

  return (
    <div className="w-full flex justify-center px-10 3xl:px-0">
      <nav className="static top-0 grid grid-cols-12 justify-between items-center max-w-7xl w-full py-6">
        {/* Logo + desktop links */}
        <div className="col-span-8 flex items-center gap-4">
          <Link href="/" legacyBehavior>
            <a className="text-2xl font-semibold text-black dark:text-white">
              DscInflux
            </a>
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                legacyBehavior
                {...(item.external ? { target: "_blank", rel: "noopener" } : {})}
              >
                <a className="text-slate-600 font-medium dark:text-zinc-400 hover:text-black hover:dark:text-white transition">
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile hamburger */}
        <div className="col-span-4 lg:hidden flex justify-end">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-transparent hover:bg-gray-500/5 transition"
          >
            <FaBars />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 rounded-md shadow-lg z-20">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.link}
                  legacyBehavior
                  {...(item.external ? { target: "_blank", rel: "noopener" } : {})}
                >
                  <a className="block px-4 py-2 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700">
                    {item.label}
                  </a>
                </Link>
              ))}
              <div className="px-4 py-2">
                <ThemeSelector />
              </div>
              {session ? (
                <>
                  <Link href={`/profile/${session.user?.id}`} legacyBehavior>
                    <a className="block px-4 py-2 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700">
                      Profile
                    </a>
                  </Link>
                  <Link href={`/${session.user?.id}/edit`} legacyBehavior>
                    <a className="block px-4 py-2 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700">
                      Settings
                    </a>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  <FaDiscord className="inline-block mr-2" />
                  Login
                </button>
              )}
            </div>
          )}
        </div>

        {/* Desktop user + theme */}
        <div className="col-span-4 hidden lg:flex items-center justify-end gap-4">
          {session ? (
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-400/10 transition">
                {session.user?.avatar ? (
                  <img
                    src={session.user.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <FaUser />
                )}
                <span className="font-medium text-black dark:text-white">
                  {session.user?.display_name || session.user?.username || session.user?.name}
                </span>
              </button>
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 rounded-md shadow-lg z-20 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
                <Link href={`/${session.user?.id}`} legacyBehavior>
                  <a className="block px-4 py-2 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700">
                    Profile
                  </a>
                </Link>
                <Link href={`/${session.user?.id}/edit`} legacyBehavior>
                  <a className="block px-4 py-2 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700">
                    Settings
                  </a>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 rounded-xl px-5 py-2 hover:bg-gray-400/10 transition"
            >
              <FaDiscord />
              Login
            </button>
          )}

          <div>
            <ThemeSelector />
          </div>
        </div>
      </nav>
    </div>
);
}
