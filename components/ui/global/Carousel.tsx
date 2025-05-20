"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type CarouselProps<T> = {
  header: (
    next: () => void,
    prev: () => void,
    isPrev: boolean,
    isNext: boolean,
  ) => React.ReactNode;
  slides: T[];
  children: (slides: T[]) => React.ReactNode[];
  perPage?: number;
};

export default function Carousel<T>({
  header,
  slides,
  children,
  perPage = 3,
}: CarouselProps<T>) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(slides.length / perPage);

  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));
  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));

  const isNext = page < totalPages - 1;
  const isPrev = page > 0;

  const slideChunk = slides.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="w-full space-y-6">
      {header(handleNext, handlePrev, isPrev, isNext)}

      <div className="relative">
        {/* Arrows */}
        {isPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-0 z-10 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 dark:bg-black/30 dark:hover:bg-black/60 backdrop-blur p-3 rounded-full shadow"
            aria-label="Previous"
          >
            <FaChevronLeft className="text-xl text-black dark:text-white" />
          </button>
        )}

        {isNext && (
          <button
            onClick={handleNext}
            className="absolute right-0 z-10 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 dark:bg-black/30 dark:hover:bg-black/60 backdrop-blur p-3 rounded-full shadow"
            aria-label="Next"
          >
            <FaChevronRight className="text-xl text-black dark:text-white" />
          </button>
        )}

        <motion.div
          key={page}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {children(slideChunk)}
        </motion.div>
      </div>
    </div>
  );
}
