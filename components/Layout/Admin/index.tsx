"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaSearch,
  FaBan,
  FaCheck,
  FaUser,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import UserCard from "@/components/cards/UserCards";
import type { Entity } from "@/types/entity";

export default function EntityManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "discordId">("name");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [entityToManage, setEntityToManage] = useState<Entity | null>(null);
  const [actionType, setActionType] = useState<
    "ban" | "unban" | "verify" | "unverify" | null
  >(null);

  const queryClient = useQueryClient();

  const {
    data: entity,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["entity", searchQuery, searchType],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;
      const param = searchType === "name" ? "name" : "userId";
      const response = await fetch(`/api/get/entity?${param}=${searchQuery}`);
      if (!response.ok) throw new Error("Entity not found");
      return response.json();
    },
    enabled: false,
  });

  // Ban mutation
  const banMutation = useMutation({
    mutationFn: async (entityId: string) => {
      const response = await fetch(`/api/post/admin/entity/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to ban entity");
      }
      return { entityId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entity"] });
      setNotification({
        message: `Successfully banned ${entity?.Username}`,
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (error: any) => {
      setNotification({
        message: error.message || "Failed to ban entity",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
    },
  });

  // Unban mutation
  const unbanMutation = useMutation({
    mutationFn: async (entityId: string) => {
      const response = await fetch(`/api/post/admin/entity/unban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to unban entity");
      }
      return { entityId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entity"] });
      setNotification({
        message: `Successfully unbanned ${entity?.Username}`,
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (error: any) => {
      setNotification({
        message: error.message || "Failed to unban entity",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
    },
  });

  // Verify mutation
  const verifyMutation = useMutation({
    mutationFn: async (entityId: string) => {
      const response = await fetch(`/api/post/admin/entity/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to verify entity");
      }
      return { entityId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entity"] });
      setNotification({
        message: `Successfully verified ${entity?.Username}`,
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (error: any) => {
      setNotification({
        message: error.message || "Failed to verify entity",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
    },
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      refetch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const confirmAction = (
    entity: Entity,
    action: "ban" | "unban" | "verify" | "unverify",
  ) => {
    setEntityToManage(entity);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const executeAction = () => {
    if (!entityToManage || !actionType) return;

    if (actionType === "ban") {
      banMutation.mutate(entityToManage.id);
    } else if (actionType === "unban") {
      unbanMutation.mutate(entityToManage.id);
    } else if (actionType === "verify") {
      verifyMutation.mutate(entityToManage.id);
    } else if (actionType === "unverify") {
      // Call unverify endpoint
      fetch(`/api/post/admin/entity/unverify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId: entityToManage.id }),
      })
        .then(async (res) => {
          if (!res.ok)
            throw new Error(
              (await res.json()).error || "Failed to unverify entity",
            );
          queryClient.invalidateQueries({ queryKey: ["entity"] });
          setNotification({
            message: `Successfully unverified ${entityToManage.Username}`,
            type: "success",
          });
          setTimeout(() => setNotification(null), 3000);
        })
        .catch((error) => {
          setNotification({
            message: error.message || "Failed to unverify entity",
            type: "error",
          });
          setTimeout(() => setNotification(null), 3000);
        });
    }

    setShowConfirmModal(false);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="color-layout layout-blue"></div>

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-8"
        >
          <div className="flex items-center mb-6">
            <div className="bg-primary/20 p-3 rounded-xl mr-4">
              <FaShieldAlt className="text-primary text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Entity Management</h1>
              <p className="text-gray-400">
                Check and manage entity ban status
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setSearchType("name")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  searchType === "name"
                    ? "bg-primary text-white"
                    : "bg-gray-700/50 text-gray-400 hover:text-white"
                }`}
              >
                Search by Name
              </button>
              <button
                onClick={() => setSearchType("discordId")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  searchType === "discordId"
                    ? "bg-primary text-white"
                    : "bg-gray-700/50 text-gray-400 hover:text-white"
                }`}
              >
                Search by Discord ID
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  searchType === "name"
                    ? "Enter username or URL..."
                    : "Enter Discord ID..."
                }
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
              />
              <FaSearch
                className="absolute left-3 top-3.5 text-gray-500"
                size={16}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className={`px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 ${
                searchQuery.trim()
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-gray-700/50 cursor-not-allowed"
              }`}
            >
              <FaSearch />
              Search
            </motion.button>
          </div>
        </motion.div>

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

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="mb-4"
              >
                <FaSearch className="text-primary text-4xl" />
              </motion.div>
              <p className="text-gray-300 text-lg">Searching for entity...</p>
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30 shadow-xl flex flex-col items-center justify-center"
            >
              <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-red-400 mb-2">
                Entity Not Found
              </h3>
              <p className="text-gray-300 text-center">
                We couldn't find an entity with the provided{" "}
                {searchType === "name" ? "name" : "Discord ID"}.
                <br />
                Please check your input and try again.
              </p>
            </motion.div>
          )}

          {entity && !isLoading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl"
            >
              <div className="mb-6">
                <UserCard entity={entity} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaUser className="text-primary" />
                    Basic Information
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discord ID:</span>
                      <span className="font-medium">{entity.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Username:</span>
                      <span className="font-medium">{entity.Username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Display Name:</span>
                      <span className="font-medium">{entity.displayname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">URL:</span>
                      <span className="font-medium">{entity.url}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="font-medium">{entity.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaShieldAlt className="text-primary" />
                    Status Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Ban Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                          entity.isBanned
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {entity.isBanned ? (
                          <>
                            <FaBan size={12} /> Banned
                          </>
                        ) : (
                          <>
                            <FaCheck size={12} /> Active
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Verification:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                          entity.isVerified
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {entity.isVerified ? (
                          <>
                            <FaCheckCircle size={12} /> Verified
                          </>
                        ) : (
                          <>
                            <FaExclamationTriangle size={12} /> Unverified
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Staff Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                          entity.staff
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {entity.staff ? (
                          <>
                            <FaShieldAlt size={12} /> Staff
                          </>
                        ) : (
                          <>
                            <FaUser size={12} /> Regular User
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Created At:</span>
                      <span className="text-gray-300">
                        {new Date(entity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Last Updated:</span>
                      <span className="text-gray-300">
                        {new Date(entity.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                {entity.isBanned ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => confirmAction(entity, "unban")}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium flex items-center gap-2"
                  >
                    <FaCheck />
                    Unban Entity
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => confirmAction(entity, "ban")}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium flex items-center gap-2"
                  >
                    <FaBan />
                    Ban Entity
                  </motion.button>
                )}

                {!entity.isVerified && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => confirmAction(entity, "verify")}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium flex items-center gap-2"
                  >
                    <FaCheckCircle />
                    Verify Entity
                  </motion.button>
                )}

                {entity.isVerified && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => confirmAction(entity, "unverify")}
                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-xl text-white font-medium flex items-center gap-2"
                  >
                    <FaExclamationTriangle />
                    Unverify Entity
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl"
            >
              <div className="flex items-center mb-4">
                <div
                  className={`p-3 rounded-full mr-3 ${
                    actionType === "ban"
                      ? "bg-red-500/20 text-red-500"
                      : actionType === "unban"
                        ? "bg-green-500/20 text-green-500"
                        : actionType === "verify"
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-yellow-500/20 text-yellow-500"
                  }`}
                >
                  {actionType === "ban" && <FaBan size={20} />}
                  {actionType === "unban" && <FaCheck size={20} />}
                  {actionType === "verify" && <FaCheckCircle size={20} />}
                  {actionType === "unverify" && (
                    <FaExclamationTriangle size={20} />
                  )}
                </div>
                <h3 className="text-xl font-bold">
                  Confirm{" "}
                  {actionType === "ban"
                    ? "Ban"
                    : actionType === "unban"
                      ? "Unban"
                      : actionType === "verify"
                        ? "Verification"
                        : actionType === "unverify"
                          ? "Unverify"
                          : ""}
                </h3>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to {actionType} {entityToManage?.Username}
                ?
                {actionType === "ban" &&
                  " This will restrict their access to the platform."}
                {actionType === "unverify" &&
                  " This will remove their verified status."}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeAction}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center ${
                    actionType === "ban"
                      ? "bg-red-600 hover:bg-red-700"
                      : actionType === "unban"
                        ? "bg-green-600 hover:bg-green-700"
                        : actionType === "verify"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                >
                  {actionType === "ban" && (
                    <>
                      <FaBan size={14} className="mr-2" /> Ban User
                    </>
                  )}
                  {actionType === "unban" && (
                    <>
                      <FaCheck size={14} className="mr-2" /> Unban User
                    </>
                  )}
                  {actionType === "verify" && (
                    <>
                      <FaCheckCircle size={14} className="mr-2" /> Verify User
                    </>
                  )}
                  {actionType === "unverify" && (
                    <>
                      <FaExclamationTriangle size={14} className="mr-2" />{" "}
                      Unverify User
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
