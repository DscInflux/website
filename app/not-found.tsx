"use client";

import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="color-layout layout-blue"></div>

      {/* Animated background shapes */}
      <div className="background-shapes"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.h1
              animate={{
                textShadow: [
                  "0 0 20px rgba(79, 70, 229, 0.5)",
                  "0 0 40px rgba(79, 70, 229, 0.8)",
                  "0 0 20px rgba(79, 70, 229, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent font-jakarta"
            >
              404
            </motion.h1>
          </motion.div>

          {/* Content card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 dark:border-white/10 shadow-2xl"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <Search className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-white font-jakarta"
            >
              Page Not Found
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-gray-300 mb-8 leading-relaxed"
            >
              Oops! The page you're looking for seems to have vanished into the
              digital void. Don't worry, even the best explorers sometimes take
              a wrong turn.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                Go Home
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Floating animation elements */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
              animate={{
                x: [0, 100, -100, 0],
                y: [0, -100, 100, 0],
                scale: [1, 1.5, 0.5, 1],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 20}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
