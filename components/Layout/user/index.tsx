"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  HeartCrack,
  Edit,
  Briefcase,
  MapPin,
  Cake,
  Users,
  Languages,
  Info,
  Share2,
  Zap,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { MdVerified } from "react-icons/md";
import { RiTimeZoneFill } from "react-icons/ri";
import type { Entity } from "@/types/entity";
import { Code, Handshake, Shield } from "lucide-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ImageModal, { useImageModal } from "@/components/ui/ImageModal";

export default function UserProfile({ username }: { username: string }) {
  const { data: session } = useSession();
  const user = session?.user || null;
  const queryClient = useQueryClient();
  const imageModal = useImageModal();

  // Fetch user profile data
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<Entity, Error>({
    queryKey: ["user-profile", username],
    queryFn: async () => {
      const response = await fetch(`/api/get/entity?name=${username}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      return response.json();
    },
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });

  // Like/unlike mutation
  const likeMutation = useMutation({
    mutationFn: async (action: "like" | "unlike") => {
      if (!data) throw new Error("No user data");
      const res = await fetch(
        `/api/post/entity/heart?action=${action}&url=${data.url}`,
        {
          method: "POST",
        },
      );
      return res.json();
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", username] });
    },
  });

  // Set liked and likes count
  const liked = data && user ? data.likes?.includes(user.id) : false;
  const likes = data?.likes?.length || 0;

  const toggleLike = () => {
    if (!data || likeMutation.isPending) return;
    likeMutation.mutate(liked ? "unlike" : "like");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light dark:bg-dark">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-primary rounded-full border-t-transparent"
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light dark:bg-dark">
        <div className="text-center p-8 max-w-md mx-auto bg-white dark:bg-dark rounded-xl shadow-lg backdrop-blur-sm bg-opacity-50 dark:bg-opacity-50">
          <h1 className="text-2xl font-bold text-primary mb-4">
            User Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {error?.message ||
              "The user you're looking for doesn't exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: Date | undefined) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAge = (dateString: Date | undefined) => {
    if (!dateString) return "";
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return ` (${age} years)`;
  };

  const cards = [
    {
      upper: true,
      name: "About Me",
      subtitle: "Who am I?",
      isPrivate: false,
      isEmpty: !data.about,
      value: data.about,
      icon: <Info className="text-primary" strokeWidth={1.5} />,
    },
    {
      upper: false,
      name: "Occupation",
      subtitle: "What do I do?",
      isPrivate: false,
      isEmpty: !data.occupation || data.occupation.length === 0,
      value: data.occupation?.join(", "),
      icon: <Briefcase className="text-primary" strokeWidth={1.5} />,
    },
    {
      upper: false,
      name: "Location",
      subtitle: "Where do I live?",
      isPrivate: data.isLocationPrivate,
      isEmpty: !data.location,
      value: data.location,
      icon: <MapPin className="text-primary" strokeWidth={1.5} />,
    },
    {
      upper: false,
      name: "Birthday",
      subtitle: "When was I born?",
      isPrivate: data.isBirthdayPrivate,
      isEmpty: !data.birthday,
      value: data.birthday
        ? `${formatDate(data.birthday)}${getAge(data.birthday)}`
        : "",
      icon: <Cake className="text-primary" strokeWidth={1.5} />,
    },
    {
      upper: false,
      name: "Gender",
      subtitle: "What is my gender?",
      isPrivate: data.isGenderPrivate,
      isEmpty: !data.gender,
      value: data.gender,
      icon: <Users className="text-primary" strokeWidth={1.5} />,
    },
    {
      upper: false,
      name: "Pronouns",
      subtitle: "What are my pronouns?",
      isPrivate: data.isPronounsPrivate,
      isEmpty: !data.gender && !data.pronouns,
      value: data.pronouns,
      icon: <Users className="text-primary" strokeWidth={1.5} />,
    },
    {
      upper: false,
      name: "Native Language",
      subtitle: "What is my native language?",
      isPrivate: false,
      isEmpty: !data.language,
      value: data.language,
      icon: <Languages className="text-primary" strokeWidth={1.5} />,
    },
    {
      upper: false,
      name: "Sexuality",
      subtitle: "What is my sexuality?",
      isPrivate: data.isSexualityPrivate,
      isEmpty: !data.sexuality,
      value: data.sexuality,
      icon: <Heart className="text-primary" strokeWidth={1.5} />,
    },
    {
      upper: false,
      name: "Timezone",
      subtitle: "What is my timezone?",
      isPrivate: false,
      isEmpty: !data.timeZone,
      value: data.timeZone,
      icon: <RiTimeZoneFill className="text-primary" strokeWidth={1.5} />,
    },
  ];

  return (
    <>
      <Head>
        <title>{data.DisplayName || username} | DscInflux</title>
        <meta
          name="description"
          content={data.about || "User profile on DscInflux"}
        />
        <meta
          property="og:title"
          content={data.DisplayName || username}
        />
        <meta
          property="og:description"
          content={data.about || "User profile on DscInflux"}
        />
        <meta
          property="og:image"
          content={
            data.banner || data.avatar || "http://purrquinox.com/banner.png"
          }
        />
        <meta
          property="og:url"
          content={
            typeof window !== "undefined" ? window.location.href : undefined
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="flex flex-col items-center justify-center px-4 md:px-10 3xl:px-0 min-h-screen">
        {/* Image Modal for avatar/banner */}
        <ImageModal
          isOpen={imageModal.modalState.isOpen}
          onClose={imageModal.closeModal}
          src={imageModal.modalState.src}
          alt={imageModal.modalState.alt}
          type={imageModal.modalState.type}
          username={data.Username || username}
        />
        <div className="max-w-7xl w-full">
          <div id="user-header" className="mb-12 relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-3xl overflow-hidden z-0">
              <div className="absolute inset-0 opacity-30 dark:opacity-50 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent_50%)]"></div>
              <div className="absolute inset-0 opacity-30 dark:opacity-50 bg-[radial-gradient(circle_at_bottom_left,rgba(67,56,202,0.15),transparent_50%)]"></div>
            </div>

            {/* Banner */}
            <div
              className="w-full h-[400px] rounded-3xl relative overflow-hidden z-10 shadow-xl group cursor-pointer"
              onClick={() =>
                imageModal.openModal(
                  data.banner || "http://purrquinox.com/banner.png",
                  `${data.Username || username}'s Banner`,
                  "banner",
                  data.Username || username,
                )
              }
              tabIndex={0}
              role="button"
              aria-label="View banner image"
            >
              {data.banner ? (
                <Image
                  id="user-banner"
                  src={data.banner || "http://purrquinox.com/banner.png"}
                  alt="Banner"
                  className="absolute object-cover w-full h-full"
                  fill
                  priority
                  draggable={false}
                  // Remove onClick from Image, handled by parent
                />
              ) : (
                <div className="absolute w-full h-full bg-gradient-to-r from-primary to-secondary opacity-50" />
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </div>

            {/* User info section */}
            <div
              id="user-info"
              className="lg:pl-16 pr-0 flex flex-col lg:flex-row items-center gap-6 relative z-20"
            >
              {/* Avatar */}
              <div className="w-40 h-40 -mt-20 rounded-full relative ring-8 ring-light dark:ring-dark overflow-hidden flex-shrink-0 shadow-2xl">
                {data.avatar ? (
                  <Image
                    src={
                      data.avatar ||
                      "https://purrquinox.com/_next/image?url=%2Flogo.png&w=32&q=75"
                    }
                    alt="Avatar"
                    id="user-avatar"
                    className="w-full h-full object-cover cursor-pointer"
                    width={160}
                    height={160}
                    onClick={() =>
                      imageModal.openModal(
                        data.avatar,
                        `${data.Username || username}'s Avatar`,
                        "avatar",
                        data.Username || username,
                      )
                    }
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/80 to-secondary flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">
                      {data.Username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full mt-4 lg:mt-0">
                <div className="flex items-center justify-center lg:justify-start text-center lg:text-left gap-4 w-full mb-6 lg:mb-0">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary dark:from-white dark:to-primary/80">
                        {data.Username}
                      </h1>
                      <div className="flex items-center gap-2">
                        {data.isVerified && (
                          <div className="group relative">
                            <MdVerified className="text-2xl text-primary" />
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark text-black dark:text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                              Verified Profile
                            </div>
                          </div>
                        )}
                        {data.staff && (
                          <div className="group relative">
                            <Shield className="text-2xl text-red-500" />
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark text-black dark:text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                              Staff
                            </div>
                          </div>
                        )}
                        {data.isDeveloper && (
                          <div className="group relative">
                            <Code className="text-2xl text-green-500" />
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark text-black dark:text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                              Developer
                            </div>
                          </div>
                        )}
                        {data.isPartner && (
                          <div className="group relative">
                            <Handshake className="text-2xl text-yellow-500" />
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark text-black dark:text-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                              Partner
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {data.DisplayName && (
                      <span className="text-xl font-medium text-zinc-500 dark:text-zinc-400">
                        {data.DisplayName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-end gap-4 w-full lg:w-2/4">
                  <div className="relative group">
                    <button
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 ${
                        liked
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/20"
                          : "bg-white dark:bg-dark/80 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-500 hover:shadow-lg hover:shadow-red-500/10"
                      }`}
                      onClick={toggleLike}
                      disabled={likeMutation.isPending}
                    >
                      {liked ? (
                        <Heart className="w-5 h-5" />
                      ) : (
                        <HeartCrack className="w-5 h-5" />
                      )}
                      <span className="font-medium">{likes}</span>
                    </button>
                  </div>
                  {data.isSelf && (
                    <Link href={`/${data.url}/edit`}>
                      <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                        <Edit className="w-5 h-5" />
                        <span className="font-medium">Edit Profile</span>
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About section */}
          <AnimatePresence>
            {cards
              .filter((el) => el.upper)
              .map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-6 px-8 rounded-2xl shadow-xl dark:shadow-2xl backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 border border-gray-100 dark:border-gray-800 w-full mb-8"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
                      {card.icon}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h1 className="text-xl font-semibold">{card.name}</h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                  {card.isPrivate ? (
                    <p className="text-md text-gray-500 dark:text-gray-400 italic">
                      This information is private.
                    </p>
                  ) : card.isEmpty ? (
                    <p className="text-md text-gray-500 dark:text-gray-400 italic">
                      This information is not set. wow
                    </p>
                  ) : (
                    <p className="text-md whitespace-pre-line leading-relaxed">
                      {card.value}
                    </p>
                  )}
                </motion.div>
              ))}
          </AnimatePresence>

          {/* Info cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
            <AnimatePresence>
              {cards
                .filter((el) => !el.upper)
                .map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="p-6 px-8 rounded-2xl shadow-lg dark:shadow-xl backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-primary/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
                        {card.icon}
                      </div>
                      <div className="flex flex-col justify-center">
                        <h1 className="text-xl font-semibold">{card.name}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {card.subtitle}
                        </p>
                      </div>
                    </div>
                    {card.isPrivate ? (
                      <p className="text-md text-gray-500 dark:text-gray-400 italic">
                        This information is private.
                      </p>
                    ) : card.isEmpty ? (
                      <p className="text-md text-gray-500 dark:text-gray-400 italic">
                        This information is not set. damn
                      </p>
                    ) : (
                      <p className="text-md text-gray-500 dark:text-gray-400">
                        {card.value}
                      </p>
                    )}
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* Roles and Skills section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="p-6 px-8 rounded-2xl shadow-lg dark:shadow-xl backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-primary/10 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
                  <Sparkles className="text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-xl font-semibold">My Roles</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Roles that I have.
                  </p>
                </div>
              </div>
              {!data.roles || data.roles.length === 0 ? (
                <p className="text-md text-gray-500 dark:text-gray-400 italic">
                  idk i didnt set this just take a guess.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.roles.map((role, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-full px-4 py-2 text-sm font-medium hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200"
                    >
                      {role}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="p-6 px-8 rounded-2xl shadow-lg dark:shadow-xl backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-primary/10 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
                  <Zap className="text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-xl font-semibold">My Skills</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    What I know?
                  </p>
                </div>
              </div>
              {!data.skills || data.skills.length === 0 ? (
                <p className="text-md text-gray-500 dark:text-gray-400 italic">
                  This information is not set. idk too man
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-full px-4 py-2 text-sm font-medium hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Socials section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="grid grid-cols-1 gap-6 w-full mt-6 mb-12"
          >
            <div className="p-6 px-8 rounded-2xl shadow-lg dark:shadow-xl backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-primary/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 p-3 rounded-xl">
                  <Share2 className="text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-xl font-semibold">My Socials</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Links to my socials.
                  </p>
                </div>
              </div>
              {!data.socials || data.socials.length === 0 ? (
                <p className="text-md text-gray-500 dark:text-gray-400 italic">
                  This information is not set. Why you may ask? idk
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-white ">
                  {data.socials.map((social, i) => (
                    <a
                      href={social.url + "?utm_source=dscinflux.xyz"}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={i}
                      className="flex items-center flex items-center gap-2 bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-full px-4 py-2 text-sm font-medium hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200 text-white justify-between relative border border-gray-100 dark:border-gray-800 hover:border-primary/20 active:border-primary/50 rounded-xl px-6 py-4 transition-all duration-200 cursor-pointer hover:shadow-lg group"
                      style={{ color: social.color || "currentColor" }}
                    >
                      <h1 className="capitalize text-md text-white font-medium select-none">
                        {social.name}
                      </h1>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
