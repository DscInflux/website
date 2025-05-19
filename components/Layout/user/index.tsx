"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  FaHeart,
  FaHeartBroken,
  FaUserEdit,
  FaBriefcase,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaLanguage,
  FaInfoCircle,
  FaShareAlt,
  FaBolt,
  FaMagic,
} from "react-icons/fa"
import { MdVerified } from "react-icons/md"
import { RiVipDiamondFill } from "react-icons/ri"
import type { Entity } from "@/types/entity"

export default function UserProfile({ username }: { username: string }) {
  const [data, setData] = useState<Entity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/get/entity?name=${username}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const userData = await response.json()
        setData(userData)
        setLiked(userData.isLiked || false)
        setLikes(userData.likes?.length || 0)
      } catch (err) {
        setError("Failed to load user profile")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [username])

  const toggleLike = async () => {
    if (!data) return

    try {
      if (liked) {
        // Unlike logic would go here
        setLiked(false)
        setLikes((prev) => prev - 1)
      } else {
        // Like logic would go here
        setLiked(true)
        setLikes((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light dark:bg-dark">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary rounded-full border-t-transparent"
        />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light dark:bg-dark">
        <div className="text-center p-8 max-w-md mx-auto bg-white dark:bg-dark rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-primary mb-4">User Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {error || "The user you're looking for doesn't exist or has been removed."}
          </p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: Date | undefined) => {
    if (!dateString) return "Not specified"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getAge = (dateString: Date | undefined) => {
    if (!dateString) return ""
    const birthDate = new Date(dateString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return ` (${age} years)`
  }

  const genders = {
    "He/Him": {
      name: "Male",
      pronouns: "He/Him",
    },
    "She/Her": {
      name: "Female",
      pronouns: "She/Her",
    },
    "They/Them": {
      name: "Non-Binary",
      pronouns: "They/Them",
    },
    Other: {
      name: "Other",
      pronouns: "Other",
    },
  }

  const cards = [
    {
      upper: true,
      name: "About Me",
      subtitle: "Who am I?",
      isPrivate: false,
      isEmpty: !data.about,
      value: data.about,
      icon: <FaInfoCircle className="text-4xl text-primary" />,
    },
    {
      upper: false,
      name: "Occupation",
      subtitle: "What do I do?",
      isPrivate: false,
      isEmpty: !data.occupation || data.occupation.length === 0,
      value: data.occupation?.join(", "),
      icon: <FaBriefcase className="text-4xl text-primary" />,
    },
    {
      upper: false,
      name: "Location",
      subtitle: "Where do I live?",
      isPrivate: data.isLocationPrivate,
      isEmpty: !data.location,
      value: data.location,
      icon: <FaMapMarkerAlt className="text-4xl text-primary" />,
    },
    {
      upper: false,
      name: "Birthday",
      subtitle: "When was I born?",
      isPrivate: data.isBirthdayPrivate,
      isEmpty: !data.birthday,
      value: data.birthday ? `${formatDate(data.birthday)}${getAge(data.birthday)}` : "",
      icon: <FaBirthdayCake className="text-4xl text-primary" />,
    },
    {
      upper: false,
      name: "Gender",
      subtitle: "What is my gender?",
      isPrivate: data.isGenderPrivate,
      isEmpty: !data.gender,
      value: data.gender ? genders[data.gender as keyof typeof genders]?.name || data.gender : "",
      icon: <FaVenusMars className="text-4xl text-primary" />,
    },
    {
      upper: false,
      name: "Pronouns",
      subtitle: "What are my pronouns?",
      isPrivate: data.isPronounsPrivate,
      isEmpty: !data.gender && !data.pronouns,
      value:
        data.pronouns || (data.gender ? genders[data.gender as keyof typeof genders]?.pronouns || data.gender : ""),
      icon: <FaVenusMars className="text-4xl text-primary" />,
    },
    {
      upper: false,
      name: "Native Language",
      subtitle: "What is my native language?",
      isPrivate: false,
      isEmpty: !data.language,
      value: data.language,
      icon: <FaLanguage className="text-4xl text-primary" />,
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center px-10 3xl:px-0">
      <div className="max-w-7xl w-full">
        <div id="user-header" className="mb-12">
          <div className="w-full h-[400px] bg-primary rounded-lg relative overflow-hidden">
            {data.banner ? (
              <Image
                id="user-banner"
                src={data.banner || "http://purrquinox.com/banner.png"}
                alt="Banner"
                className="absolute object-cover w-full h-full"
                fill
                priority
              />
            ) : (
              <div className="absolute w-full h-full bg-gradient-to-r from-primary to-secondary opacity-50" />
            )}
          </div>
          <div id="user-info" className="lg:pl-16 pr-0 flex flex-col lg:flex-row items-center gap-6">
            <div className="w-36 h-36 -mt-[4.5rem] rounded-full relative ring-8 ring-light dark:ring-dark overflow-hidden flex-shrink-0">
              {data.avatar ? (
                <Image
                  src={data.avatar || "https://purrquinox.com/_next/image?url=%2Flogo.png&w=32&q=75"}
                  alt="Avatar"
                  id="user-avatar"
                  className="w-full h-full object-cover"
                  width={144}
                  height={144}
                />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-500 dark:text-gray-400">
                    {data.discordUsername?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full">
              <div className="flex items-center justify-center lg:justify-start text-center lg:text-left gap-4 w-full mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold text-center">
                  {data.discordUsername}
                  {data.discordDisplayName && (
                    <span className="block text-xl font-medium text-zinc-500">{data.discordDisplayName}</span>
                  )}
                </h1>
                <div className="flex items-center gap-2">
                  {data.isVerified && (
                    <div className="group relative">
                      <MdVerified className="text-3xl text-primary" />
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark text-black dark:text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Verified Profile
                      </div>
                    </div>
                  )}
                  {data.isPremium && (
                    <div className="group relative">
                      <RiVipDiamondFill className="text-3xl text-primary" />
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark text-black dark:text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Premium Profile
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end gap-4 w-full lg:w-2/4">
                <div className="relative group">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      liked
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white dark:bg-dark text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 border border-red-500"
                    }`}
                    onClick={toggleLike}
                  >
                    {liked ? <FaHeart /> : <FaHeartBroken />}
                    <span>{likes}</span>
                  </button>
                </div>
                {data.isSelf && (
                  <Link href={`/${data.url}/edit`}>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-200">
                      <FaUserEdit />
                      <span>Edit Profile</span>
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 w-full mt-4">
          {cards
            .filter((el) => el.upper)
            .map((card, i) => (
              <div key={i} className="p-4 px-6 bg-light dark:bg-dark rounded-lg dark:shadow-lg w-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0">{card.icon}</div>
                  <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-semibold">{card.name}</h1>
                    <p className="text-sm text-gray-500">{card.subtitle}</p>
                  </div>
                </div>
                {card.isPrivate ? (
                  <p className="text-md text-gray-500">This information is private.</p>
                ) : card.isEmpty ? (
                  <p className="text-md text-gray-500">This information is not set.</p>
                ) : (
                  <p className="text-md whitespace-pre-line">{card.value}</p>
                )}
              </div>
            ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-4">
          {cards
            .filter((el) => !el.upper)
            .map((card, i) => (
              <div key={i} className="p-4 px-6 bg-light dark:bg-dark rounded-lg dark:shadow-lg w-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0">{card.icon}</div>
                  <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-semibold">{card.name}</h1>
                    <p className="text-sm text-gray-500">{card.subtitle}</p>
                  </div>
                </div>
                {card.isPrivate ? (
                  <p className="text-md text-gray-500">This information is private.</p>
                ) : card.isEmpty ? (
                  <p className="text-md text-gray-500">This information is not set.</p>
                ) : (
                  <p className="text-md text-gray-500">{card.value}</p>
                )}
              </div>
            ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
          <div className="p-4 px-6 bg-light dark:bg-dark rounded-lg dark:shadow-lg w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0">
                <FaMagic className="text-4xl text-primary" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-semibold">My Roles</h1>
                <p className="text-sm text-gray-500">Roles that I have.</p>
              </div>
            </div>
            {!data.roles || data.roles.length === 0 ? (
              <p className="text-md text-gray-500">This information is not set.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.roles.map((role, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-light dark:bg-dark border border-primary/5 rounded-lg px-3 py-1.5"
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 px-6 bg-light dark:bg-dark rounded-lg dark:shadow-lg w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0">
                <FaBolt className="text-4xl text-primary" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-semibold">My Skills</h1>
                <p className="text-sm text-gray-500">What I know?</p>
              </div>
            </div>
            {!data.skills || data.skills.length === 0 ? (
              <p className="text-md text-gray-500">This information is not set.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-light dark:bg-dark border border-primary/5 rounded-lg px-3 py-1.5"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full mt-4 mb-8">
          <div className="p-4 px-6 bg-light dark:bg-dark rounded-lg dark:shadow-lg w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0">
                <FaShareAlt className="text-4xl text-primary" />
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-semibold">My Socials</h1>
                <p className="text-sm text-gray-500">Links to my socials.</p>
              </div>
            </div>
            {!data.socials || data.socials.length === 0 ? (
              <p className="text-md text-gray-500">This information is not set.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {data.socials.map((social, i) => (
                  <a
                    href={social.url + "?utm_source=profile"}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={i}
                    className="flex items-center justify-between relative bg-light dark:bg-dark border border-primary/5 hover:border-primary/20 active:border-primary/50 rounded-lg px-6 py-3 transition-all duration-200 cursor-pointer"
                    style={{ color: social.color || "currentColor" }}
                  >
                    <h1 className="capitalize text-md select-none">{social.name}</h1>
                    <span className="text-zinc-500">↗</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
