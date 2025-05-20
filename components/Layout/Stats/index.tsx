"use client";
import { useEffect, useState } from "react";
import { FiUsers, FiBox, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface Stats {
  entities: number;
  users: number;
  entitiesVerified: number;
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  color: string;
  isVerified?: boolean;
}

const StatsCard = ({
  title,
  value,
  icon,
  description,
  color,
  isVerified = false,
}: StatsCardProps) => {
  const getGradient = () => {
    switch (color) {
      case "blue":
        return "from-blue-500/20 to-blue-600/5";
      case "purple":
        return "from-purple-500/20 to-purple-600/5";
      case "green":
        return "from-green-500/20 to-green-600/5";
      case "red":
        return "from-red-500/20 to-red-600/5";
      case "yellow":
        return "from-yellow-500/20 to-yellow-600/5";
      default:
        return "from-blue-500/20 to-blue-600/5";
    }
  };

  const getBorderColor = () => {
    switch (color) {
      case "blue":
        return "border-blue-500/20";
      case "purple":
        return "border-purple-500/20";
      case "green":
        return "border-green-500/20";
      case "red":
        return "border-red-500/20";
      case "yellow":
        return "border-yellow-500/20";
      default:
        return "border-blue-500/20";
    }
  };

  return (
    <div
      className={`bg-white dark:bg-[#070510] rounded-2xl shadow-lg p-6 border ${getBorderColor()} h-full relative overflow-hidden`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-50`}
      ></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-lg bg-white dark:bg-[#1d2341] shadow-md">
            {icon}
          </div>
          {isVerified && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
              Verified
            </span>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-3xl font-bold">{value.toLocaleString()}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

const StatLoader = () => {
  return (
    <div className="bg-white dark:bg-[#070510] rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 h-full animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
  );
};

export default function StatsComponent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/get/stats");
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const data = [
    { name: "Entities", value: stats?.entities || 0 },
    { name: "Users", value: stats?.users || 0 },
    { name: "Verified Entities", value: stats?.entitiesVerified || 0 },
  ];

  return (
    <main className="min-h-screen w-full py-16 px-4 md:px-6 relative overflow-hidden">
      <div className="background-shapes"></div>
      <div className="color-layout layout-blue"></div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Stats</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            View our stats aren't they good?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <StatLoader />
              <StatLoader />
              <StatLoader />
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <StatsCard
                  title="Total Entities"
                  value={stats?.entities || 0}
                  icon={<FiBox className="text-blue-500" size={24} />}
                  description="All entities in the system"
                  color="blue"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <StatsCard
                  title="Total Users"
                  value={stats?.users || 0}
                  icon={<FiUsers className="text-purple-500" size={24} />}
                  description="Registered user accounts"
                  color="purple"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <StatsCard
                  title="Verified Entities"
                  value={stats?.entitiesVerified || 0}
                  icon={<FiCheckCircle className="text-green-500" size={24} />}
                  description="Verified and approved entities"
                  color="green"
                  isVerified={true}
                />
              </motion.div>
            </>
          )}
        </div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="bg-white dark:bg-[#070510] rounded-2xl shadow-lg p-6 overflow-hidden relative">
            <div className="color-layout-card layout-blue opacity-10"></div>
            <h2 className="text-2xl font-bold mb-6">Analytics Overview</h2>
            {isLoading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={data}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
