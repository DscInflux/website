"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CarouselProps<T> = {
  header: (
    next: () => void,
    prev: () => void,
    isPrev: boolean,
    isNext: boolean,
  ) => React.ReactNode;
  slides: T[];
  children: (slides: T[]) => React.ReactNode;
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
    <div className="w-full space-y-4">
      {header(handleNext, handlePrev, isPrev, isNext)}

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {children(slideChunk)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
