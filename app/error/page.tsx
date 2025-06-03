"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { AlertTriangle, Home, RefreshCw, Bug, Shield, Database, Wifi, Clock } from "lucide-react"
import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()

  // Get error details from query params
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")
  const errorCode = searchParams.get("code") || "500"

  // Common NextAuth errors
  const nextAuthErrors: Record<string, { title: string; description: string; icon: any }> = {
    Configuration: {
      title: "Configuration Error",
      description: "There is a problem with the server configuration.",
      icon: Bug,
    },
    AccessDenied: {
      title: "Access Denied",
      description: "You do not have permission to sign in.",
      icon: Shield,
    },
    Verification: {
      title: "Verification Error",
      description: "The verification token has expired or has already been used.",
      icon: Clock,
    },
    Default: {
      title: "Authentication Error",
      description: "An error occurred during authentication.",
      icon: Shield,
    },
  }

  // Determine error type and details
  const getErrorDetails = () => {
    if (error && nextAuthErrors[error]) {
      return nextAuthErrors[error]
    }

    switch (errorCode) {
      case "404":
        return {
          title: "Page Not Found",
          description: "The page you are looking for does not exist.",
          icon: AlertTriangle,
        }
      case "403":
        return {
          title: "Forbidden",
          description: "You do not have permission to access this resource.",
          icon: Shield,
        }
      case "500":
        return {
          title: "Internal Server Error",
          description: "Something went wrong on our end.",
          icon: Database,
        }
      case "503":
        return {
          title: "Service Unavailable",
          description: "The service is temporarily unavailable.",
          icon: Wifi,
        }
      default:
        return {
          title: "Something Went Wrong",
          description: "An unexpected error occurred.",
          icon: AlertTriangle,
        }
    }
  }

  const errorDetails = getErrorDetails()
  const IconComponent = errorDetails.icon

  // Get all query parameters for debugging
  const allParams = Object.fromEntries(searchParams.entries())

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="color-layout layout-blue"></div>

      {/* Animated background shapes */}
      <div className="background-shapes"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Main error card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 dark:border-white/10 shadow-2xl"
          >
            {/* Error icon with animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <IconComponent className="w-12 h-12 text-white" />
                </motion.div>

                {/* Floating particles */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    animate={{
                      x: [0, 20, -20, 0],
                      y: [0, -30, -10, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                    style={{
                      top: `${20 + i * 10}%`,
                      left: `${30 + i * 20}%`,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Error code */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-4"
            >
              <span className="inline-block px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-medium border border-red-500/30">
                Error {errorCode}
              </span>
            </motion.div>

            {/* Error title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-jakarta"
            >
              {errorDetails.title}
            </motion.h1>

            {/* Error description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-300 text-center mb-8 leading-relaxed"
            >
              {errorDescription || errorDetails.description}
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                Go Home
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </motion.button>
            </motion.div>

            {/* Query parameters debug info */}
            {Object.keys(allParams).length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.8 }}
                className="border-t border-white/10 pt-6"
              >
                <details className="group">
                  <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
                    <Bug className="w-4 h-4" />
                    Debug Information
                    <motion.div
                      animate={{ rotate: 0 }}
                      className="group-open:rotate-90 transition-transform duration-200"
                    >
                      ▶
                    </motion.div>
                  </summary>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-black/30 rounded-xl border border-white/10"
                  >
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Query Parameters:</h4>
                    <div className="space-y-2">
                      {Object.entries(allParams).map(([key, value]) => (
                        <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                            {key}
                          </span>
                          <span className="text-xs font-mono text-gray-300 break-all">{value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </details>
              </motion.div>
            )}
          </motion.div>

          {/* Floating elements */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
          />

          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
          />
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full"></div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}
