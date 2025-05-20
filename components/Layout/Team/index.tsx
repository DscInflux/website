"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";
import { useTheme } from "next-themes";

interface StaffMember {
  id: string;
  username: string;
  display_name: string;
  avatar: string;
}

interface TeamData {
  staff: StaffMember[];
}

const TeamPage = () => {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch("/api/get/team");
        if (!response.ok) throw new Error("Network response was not ok");
        const data: TeamData = await response.json();
        setTeamData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load team data. Please try again later.");
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-lg rounded-xl bg-red-50 dark:bg-red-900/20">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
            Error
          </h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="background-shapes" />
      <div className="color-layout layout-blue" />

      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <FaUsers className="text-4xl text-primary mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold font-jakarta bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Our Team
            </h1>
          </div>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Meet the talented individuals behind our success, dedicated to
            delivering exceptional experiences.
          </p>
        </motion.div>

        {/* Team members grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {teamData?.staff.map((member) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              whileHover="hover"
              className="relative group perspective-right"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl -z-10 transform group-hover:scale-[1.03] transition-transform duration-300 opacity-0 group-hover:opacity-100" />

              <div className="p-6 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                      className="relative"
                    >
                      <img
                        src={member.avatar}
                        alt={member.username}
                        className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800"
                      />
                    </motion.div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                      {member.display_name}
                    </h2>
                    <p className="text-purple-600 dark:text-purple-400 font-medium mb-4">
                      @{member.username}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl blur-xl" />
            <div className="relative p-8 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Want to join our team?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We're always looking for talented individuals to join our
                growing team.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
              >
                View Careers
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamPage;
