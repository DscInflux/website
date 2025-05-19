"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaInstagram, FaGlobe, FaHeart, FaMapMarkerAlt, FaBirthdayCake, FaEnvelope } from "react-icons/fa";
import { MdVerified, MdWork } from "react-icons/md";
import Image from "next/image";
import { Entity } from "@/types/entity";

export default function UserProfile({ username }: { username: string }) {
  const [user, setUser] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/get/entity?name=${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError("Failed to load user profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light dark:bg-dark">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary rounded-full border-t-transparent"
        />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light dark:bg-dark">
        <div className="text-center p-8 max-w-md mx-auto bg-white dark:bg-dark rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-primary mb-4">User Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {error || "The user you're looking for doesn't exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "github":
        return <FaGithub />;
      case "twitter":
        return <FaTwitter />;
      case "instagram":
        return <FaInstagram />;
      default:
        return <FaGlobe />;
    }
  };

  const formatDate = (dateString: Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-light dark:bg-transparent">
      <div className="background-shapes" />
      <div className="color-layout layout-blue" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-7xl"
      >
        {/* Banner */}
        <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-24">
          <Image
            src={user.banner || "/placeholder.svg?height=300&width=1200"}
            alt="Profile Banner"
            fill
            className="object-cover"
            priority
          />
          
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute -bottom-16 left-8 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-dark overflow-hidden shadow-xl"
          >
            <Image
              src={user.avatar || "/placeholder.svg?height=160&width=160"}
              alt={user.discordUsername}
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold">{user.discordUsername}</h1>
                {user.isVerified && (
                  <motion.span
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="text-primary"
                  >
                    <MdVerified size={24} />
                  </motion.span>
                )}
                {user.isPremium && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>

              <div className="text-gray-600 dark:text-gray-300 mb-6">
                <p className="text-lg mb-4 whitespace-pre-line">{user.about}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {user.occupation && user.occupation.length > 0 && (
                    <div className="flex items-center gap-2">
                      <MdWork className="text-primary" size={20} />
                      <span>{user.occupation.join(", ")}</span>
                    </div>
                  )}
                  
                  {user.location && !user.isLocationPrivate && (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary" size={18} />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  {user.birthday && !user.isBirthdayPrivate && (
                    <div className="flex items-center gap-2">
                      <FaBirthdayCake className="text-primary" size={18} />
                      <span>{formatDate(user.birthday)}</span>
                    </div>
                  )}
                  
                  {user.email && !user.isEmailPrivate && (
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-primary" size={18} />
                      <span>{user.email}</span>
                    </div>
                  )}
                  
                  {user.gender && !user.isGenderPrivate && (
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">Gender:</span>
                      <span>{user.gender}</span>
                    </div>
                  )}
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3 mt-6"
              >
                <button className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg transition-all duration-300 flex items-center gap-2">
                  <FaHeart /> Like Profile
                </button>
                <button className="bg-white dark:bg-dark border border-primary text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-lg transition-all duration-300">
                  Message
                </button>
              </motion.div>
            </div>

            {/* Skills & Interests */}
            <div className="bg-white dark:bg-dark rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Skills & Interests</h2>
              
              {user.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-6">
                  {user.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 mb-6">No skills listed yet.</p>
              )}
              
              <h3 className="text-xl font-bold mb-3">Likes</h3>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">{user.likes?.length || 0}</span>
                <span className="text-gray-600 dark:text-gray-300">profile likes</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Social Links */}
            {user.socials && user.socials.length > 0 && (
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-dark rounded-2xl shadow-lg p-6 mb-8"
              >
                <h2 className="text-2xl font-bold mb-4">Connect</h2>
                <div className="space-y-4">
                  {user.socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      style={{ color: social.color }}
                    >
                      <span className="text-xl">{getSocialIcon(social.name)}</span>
                      <span className="font-medium">{social.username || social.name}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Discord Info */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-dark rounded-2xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">Discord</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Username</span>
                  <span className="font-medium">{user.discordUsername}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">ID</span>
                  <span className="font-medium">{user.discordId}</span>
                </div>
                {user.discordDisplayName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Display Name</span>
                    <span className="font-medium">{user.discordDisplayName}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Account Info */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-dark rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Account</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Member Since</span>
                  <span className="font-medium">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Last Updated</span>
                  <span className="font-medium">{formatDate(user.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">URL</span>
                  <span className="font-medium text-primary">{user.url}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
