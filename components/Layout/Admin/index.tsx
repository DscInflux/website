"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  FaHeart,
  FaRegHeart,
  FaUserShield,
  FaCode,
  FaHandshake,
  FaSearch,
  FaTrash,
  FaShieldAlt,
  FaChartBar,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa"
import { FaCircleCheck } from "react-icons/fa6"
import { motion, AnimatePresence } from "framer-motion"
import UserCard from "@/components/cards/UserCards";
import { Entity } from "@/types/entity"

// Types
interface Stats {
  entities: number
  users: number
  entitiesVerified: number
}


export default function AdminPanel() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [entities, setEntities] = useState<Entity[]>([])
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [banningUser, setBanningUser] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "verified" | "banned">("all")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [userToBan, setUserToBan] = useState<string | null>(null)

  // Check if user is admin
  const isAdmin = session?.user?.is_admin

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/get/stats")
        const data = await response.json()
        setStats(data.stats)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchStats()
  }, [])

  // Fetch entities
  useEffect(() => {
    const fetchEntities = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/get/entity/all")
        const data = await response.json()
        // Debug: log the API response
        console.log("Fetched entities data:", data)
        // If data is an array, use it; if it's an object with a 'data' array property, use that; else fallback to []
        let safeEntities = []
        if (Array.isArray(data)) {
          safeEntities = data
        } else if (data && Array.isArray(data.data)) {
          safeEntities = data.data
        }
        setEntities(safeEntities)
        setFilteredEntities(safeEntities)
      } catch (error) {
        console.error("Failed to fetch entities:", error)
        setEntities([])
        setFilteredEntities([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntities()
  }, [])

  // Filter entities based on search term and active tab
  useEffect(() => {
    let filtered = entities

    // Filter by tab
    if (activeTab === "verified") {
      filtered = filtered.filter((entity) => entity.isVerified)
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (entity) =>
          entity.discordUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entity.url.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredEntities(filtered)
  }, [searchTerm, entities, activeTab])

  // Show confirmation modal
  const confirmBan = (username: string) => {
    setUserToBan(username)
    setShowConfirmModal(true)
  }

  // Ban user function
  const banUser = async () => {
    if (!userToBan) return

    setBanningUser(userToBan)
    setShowConfirmModal(false)

    try {
      const response = await fetch("/api/post/admin/entity/ban", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userToBan }),
      })

      const data = await response.json()

      if (response.ok) {
        setNotification({
          message: `Successfully banned ${userToBan}`,
          type: "success",
        })

        // Update the entities list to reflect the ban
        setEntities(
          entities.map((entity) => (entity.discordUsername === userToBan ? { ...entity, is_banned: true } : entity)),
        )

        // Clear notification after 3 seconds
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      } else {
        setNotification({
          message: data.error || "Failed to ban user",
          type: "error",
        })

        // Clear notification after 3 seconds
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      }
    } catch (error) {
      setNotification({
        message: "An error occurred while banning the user",
        type: "error",
      })

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } finally {
      setBanningUser(null)
      setUserToBan(null)
    }
  }

  // If loading, show loading screen
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
          <h2 className="text-white text-xl font-semibold">Loading Admin Panel...</h2>
        </div>
      </div>
    )
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <FaShieldAlt className="text-red-500 text-6xl mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-300 max-w-md text-lg">
          You don't have permission to access the admin panel. This area is restricted to administrators only.
        </p>
        <Link
          href="/"
          className="mt-8 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all duration-200"
        >
          Return to Homepage
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white p-6 md:p-8">
      {/* Header with Stats */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-primary/20 p-3 rounded-xl mr-4">
              <FaShieldAlt className="text-primary text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400">Manage users and entities</p>
            </div>
          </div>

          {session?.user && (
            <div className="flex items-center bg-gray-800/50 p-2 rounded-xl">
              <div className="mr-3">
                <p className="text-sm font-medium">{session.user.name || session.user.email}</p>
                <p className="text-xs text-primary">Administrator</p>
              </div>
              {session.user.image && (
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/30">
                  <Image
                    src={session.user.image || "/placeholder.svg"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:translate-y-[-5px]"
          >
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400 mr-4">
                <FaUsers className="text-2xl" />
              </div>
              <div>
                <p className="text-gray-400 font-medium">Total Users</p>
                <h3 className="text-3xl font-bold">{stats?.users || "..."}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:translate-y-[-5px]"
          >
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400 mr-4">
                <FaChartBar className="text-2xl" />
              </div>
              <div>
                <p className="text-gray-400 font-medium">Total Entities</p>
                <h3 className="text-3xl font-bold">{stats?.entities || "..."}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:translate-y-[-5px]"
          >
            <div className="flex items-center">
              <div className="p-4 rounded-xl bg-green-500/10 text-green-400 mr-4">
                <FaCheckCircle className="text-2xl" />
              </div>
              <div>
                <p className="text-gray-400 font-medium">Verified Entities</p>
                <h3 className="text-3xl font-bold">{stats?.entitiesVerified || "..."}</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl border ${
                notification.type === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">Manage Entities</h2>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Tabs */}
              <div className="flex bg-gray-700/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "all" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("verified")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "verified" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Verified
                </button>
                <button
                  onClick={() => setActiveTab("banned")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "banned" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Banned
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search entities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-500" size={16} />
              </div>
            </div>
          </div>

          {/* Entities Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <UserCard key={index} entity={{}} isSkeleton={true} />
              ))}
            </div>
          ) : filteredEntities.length === 0 ? (
            <div className="text-center py-16">
              <FaSearch className="mx-auto text-gray-600 text-4xl mb-4" />
              <p className="text-gray-400 text-lg">No entities found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setActiveTab("all")
                }}
                className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntities.map((entity) => (
                <div key={entity.id || entity.url} className="flex flex-col gap-2">
                  <UserCard entity={entity} />
                  <button
                    className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
                    onClick={() => confirmBan(entity.discordUsername)}
                  >
                    <FaTrash size={14} />
                    Ban User
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ban Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-red-500/20 text-red-500 mr-3">
                <FaShieldAlt size={20} />
              </div>
              <h3 className="text-xl font-bold">Confirm Ban</h3>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to ban <span className="font-semibold text-white">{userToBan}</span>? This action
              cannot be easily undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={banUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors flex items-center"
              >
                <FaTrash size={14} className="mr-2" />
                Ban User
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
