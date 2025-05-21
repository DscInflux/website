"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  FaHome,
  FaCompass,
  FaUsers,
  FaCogs,
  FaDiscord,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaEdit,
  FaEye,
} from "react-icons/fa";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [entityUrl, setEntityUrl] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) return;
    // Prefer to use the user's id (discordId) to fetch their entity, since username/url may not match
    if (session.user?.id) {
      fetch(`/api/get/entity?discordId=${session.user.id}`)
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            if (data?.url) setEntityUrl(data.url);
            else setEntityUrl(null);
          } else {
            setEntityUrl(null);
          }
        })
        .catch(() => setEntityUrl(null));
    } else {
      setEntityUrl(null);
    }
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => signIn("discord", { callbackUrl: pathname });
  const handleLogout = () => signOut({ callbackUrl: "/" });

  const items = [
    { label: "Home", icon: <FaHome />, link: "/" },
    { label: "Explore", icon: <FaCompass />, link: "/explore" },
    { label: "Team", icon: <FaUsers />, link: "/team" },
    {
      label: "Discord",
      icon: <FaCogs />,
      link: "https://discord.gg/RPCtG7Em8g",
      external: true,
    },
  ];

  return (
    <nav className="w-full z-50 relative">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-black dark:text-white"
        >
          DscInflux
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {items.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-700 dark:text-zinc-200 hover:text-indigo-600"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.link}
                className="flex items-center space-x-1 text-gray-700 dark:text-zinc-200 hover:text-indigo-600"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ),
          )}

          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={session.user?.avatar || ""}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-gray-800 dark:text-white font-medium">
                  {session.user?.display_name ||
                    session.user?.username ||
                    "User"}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg rounded-md py-2 z-50">
                  {entityUrl ? (
                    <>
                      <Link
                        href="/user/new"
                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        <FaEdit className="mr-2" />
                        Edit Profile
                      </Link>
                      <Link
                        href={`/user/${entityUrl}`}
                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
                      >
                        <FaEye className="mr-2" />
                        View Profile
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => (window.location.href = "/user/new")}
                      className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700"
                    >
                      <FaUserPlus className="mr-2" />
                      Register Profile
                    </button>
                  )}
                  {/* Admin Option */}
                  {session.user?.is_admin && (
                    <Link
                      href="/admin"
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 text-indigo-600 dark:text-indigo-400 font-semibold"
                    >
                      <FaCogs className="mr-2" />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              <FaDiscord />
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-2xl text-gray-800 dark:text-white"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4">
          {items.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-700 dark:text-zinc-200 hover:text-indigo-600"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.link}
                className="flex items-center space-x-2 text-gray-700 dark:text-zinc-200 hover:text-indigo-600"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ),
          )}

          {session ? (
            <>
              {entityUrl ? (
                <>
                  <Link
                    href="/user/new"
                    className="flex items-center space-x-2 text-gray-700 dark:text-zinc-200 hover:text-indigo-600"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </Link>
                  <Link
                    href={`/user/${entityUrl}`}
                    className="flex items-center space-x-2 text-gray-700 dark:text-zinc-200 hover:text-indigo-600"
                  >
                    <FaEye />
                    <span>View Profile</span>
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => (window.location.href = "/user/new")}
                  className="flex items-center space-x-2 text-gray-700 dark:text-zinc-200 hover:text-indigo-600"
                >
                  <FaUserPlus />
                  <span>Register Profile</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-800"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              <FaDiscord />
              <span>Login</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
