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
  // Fetch entity for current user
  const [entityUrl, setEntityUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!session) return;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.entity && data.entity.url) {
          setEntityUrl(data.entity.url);
        } else {
          setEntityUrl(null);
        }
      })
      .catch(() => setEntityUrl(null));
  }, [session]);

  const items = [
    { label: "Home", icon: <FaHome />, link: "/" },
    { label: "Explore", icon: <FaCompass />, link: "/explore" },
    { label: "Partners", icon: <FaHandshake />, link: "/partners" },
    { label: "Team", icon: <FaUsers />, link: "/team" },
    {
      label: "Discord",
      icon: <FaCogs />,
      link: "https://discord.gg/RPCtG7Em8g",
      external: true,
    },
  ];

  const handleLogin = () => signIn("discord", { callbackUrl: pathname });
  const handleLogout = () => signOut();

  return (
    <div className="w-full flex justify-center px-6 sm:px-10 3xl:px-0 font-jakarta z-50 relative">
      <nav className="w-full max-w-7xl py-5 grid grid-cols-12 items-center">
        {/* Left section */}
        <div className="col-span-6 lg:col-span-4 flex items-center gap-4">
          <Link href="/" legacyBehavior>
            <a className="text-2xl font-bold tracking-tight text-black dark:text-white">
              DscInflux
            </a>
          </Link>
          <div className="hidden lg:flex gap-6">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.link}
                legacyBehavior
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <a className="text-sm text-slate-600 dark:text-zinc-400 hover:text-primary hover:dark:text-white font-medium transition duration-200 flex items-center gap-1">
                  {item.icon}
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </div>

        {/* Right section */}
        <div className="col-span-6 lg:col-span-8 flex justify-end items-center gap-4">
          {/* Mobile Hamburger */}
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-3 rounded-lg border border-transparent hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <FaBars className="text-lg" />
            </button>
            {menuOpen && (
              <div className="absolute top-20 right-6 w-60 bg-white dark:bg-zinc-900 rounded-lg shadow-2xl py-4 z-50 animate-fade-in-up">
                {items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.link}
                    legacyBehavior
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <a className="block px-5 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition">
                      {item.label}
                    </a>
                  </Link>
                ))}
                <div className="px-5 py-2">
                  <ThemeSelector />
                </div>
                {session ? (
                  <>
                    {entityUrl ? (
                      <>
                        <Link href={"/user/new"} legacyBehavior>
                          <a className="block px-5 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200">
                            Edit your profile
                          </a>
                        </Link>
                        <Link href={`/${entityUrl}`} legacyBehavior>
                          <a className="block px-5 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200">
                            View your profile
                          </a>
                        </Link>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          window.location.href = "/user/new";
                        }}
                        className="block w-full text-left px-5 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                      >
                        Register your profile
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full text-left px-5 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition flex items-center gap-2"
                  >
                    <FaDiscord /> Login
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Desktop user + theme */}
          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition">
                  {session.user?.avatar ? (
                    <img
                      src={session.user.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-xl" />
                  )}
                  <span className="text-sm font-medium text-black dark:text-white">
                    {session.user?.display_name ||
                      session.user?.username ||
                      session.user?.name}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 rounded-md shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  {entityUrl ? (
                    <>
                      <Link href={"/user/new"} legacyBehavior={true}>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200">
                          Edit your profile
                        </a>
                      </Link>
                      <Link href={`/${entityUrl}`} legacyBehavior={true}>
                        <a className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200">
                          View your profile
                        </a>
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        window.location.href = "/user/new";
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                    >
                      Register your profile
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <FaDiscord className="text-base" />
                Login
              </button>
            )}
            <ThemeSelector />
          </div>
        </div>
      </nav>
    </div>
  );
}
