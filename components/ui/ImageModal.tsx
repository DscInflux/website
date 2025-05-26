"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Download, Share2, ZoomIn, ZoomOut } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  type: "avatar" | "banner";
  username?: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  src,
  alt,
  type,
  username = "User"
}: ImageModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset zoom when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsZoomed(false);
      setImageLoaded(false);
    }
  }, [isOpen]);

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${username}-${type}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s ${type}`,
          text: `Check out ${username}'s ${type}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(20px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 dark:bg-black/80"
          />

          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", damping: 20 }}
            className="relative max-w-7xl max-h-[90vh] w-full mx-4 rounded-2xl overflow-hidden bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {username}'s {type === "avatar" ? "Avatar" : "Banner"}
                    </h2>
                    <p className="text-sm text-white/70">
                      Click and drag to zoom
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200 hover:scale-110"
                    title={isZoomed ? "Zoom Out" : "Zoom In"}
                  >
                    {isZoomed ? (
                      <ZoomOut className="w-5 h-5" />
                    ) : (
                      <ZoomIn className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200 hover:scale-110"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200 hover:scale-110"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Image container */}
            <div className="relative w-full h-full min-h-[60vh] flex items-center justify-center overflow-hidden">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-12 h-12 border-4 border-white/30 rounded-full border-t-white"
                  />
                </div>
              )}

              <motion.div
                animate={{
                  scale: isZoomed ? 1.15 : 1,
                }}
                transition={{ duration: 0.3, type: "spring", damping: 20 }}
                className={`relative ${
                  type === "avatar"
                    ? "w-96 h-96 rounded-full overflow-hidden"
                    : "w-full max-w-full max-h-[70vh] rounded-xl overflow-hidden flex items-center justify-center"
                } shadow-2xl cursor-pointer`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <Image
                  src={src}
                  alt={alt}
                  {...(type === "avatar"
                    ? { fill: true }
                    : { width: 1200, height: 400 })}
                  className={`object-cover transition-all duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  } ${type === "banner" ? "object-contain w-auto h-auto max-w-full max-h-[70vh]" : ""}`}
                  onLoad={() => setImageLoaded(true)}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />

                {/* Hover overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/20 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    {isZoomed ? (
                      <ZoomOut className="w-8 h-8 text-white" />
                    ) : (
                      <ZoomIn className="w-8 h-8 text-white" />
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Bottom gradient for better visibility */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to use with your existing UserProfile component
export function useImageModal() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    src: string;
    alt: string;
    type: "avatar" | "banner";
    username?: string;
  }>({
    isOpen: false,
    src: "",
    alt: "",
    type: "avatar",
    username: "",
  });

  const openModal = (
    src: string,
    alt: string,
    type: "avatar" | "banner",
    username?: string
  ) => {
    setModalState({
      isOpen: true,
      src,
      alt,
      type,
      username,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    modalState,
    openModal,
    closeModal,
  };
}