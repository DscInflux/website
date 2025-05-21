import React from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type CarouselHeaderProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  seeAll?: string;
  next: () => void;
  prev: () => void;
  isPrev: boolean;
  isNext: boolean;
};

export default function CarouselHeader({
  title,
  description,
  icon,
  seeAll,
  next,
  prev,
  isPrev,
  isNext
}: CarouselHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-1 gap-4 mb-6">
      <div className="flex items-center gap-4">
        {icon && (
          <div className="text-4xl text-primary bg-primary/10 p-3 rounded-xl hidden lg:flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white font-jakarta">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={!isPrev}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isPrev 
                ? "bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
                : "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
            aria-label="Previous"
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={next}
            disabled={!isNext}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isNext 
                ? "bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300" 
                : "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
            aria-label="Next"
          >
            <FaChevronRight size={14} />
          </button>
        </div>

        {seeAll && (
          <Link
            href={seeAll}
            className="text-primary hover:text-primary/80 text-sm font-semibold bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-all duration-200"
          >
            See all
          </Link>
        )}
      </div>
    </div>
  );
}
