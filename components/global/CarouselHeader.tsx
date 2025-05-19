import Link from "next/link";
import { ReactNode } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CarouselHeaderProps {
  title: string;
  icon: React.ReactNode;
  seeAll?: string;
  description?: string;
  next: () => void;
  prev: () => void;
  isPrev: boolean;
  isNext: boolean;
}

export default function CarouselHeader({
  title,
  icon,
  seeAll,
  description,
  next,
  prev,
  isPrev,
  isNext,
}: CarouselHeaderProps) {
  return (
    <div className="lg:flex justify-between items-center mb-6">
      <div className="flex items-center gap-4 w-full">
        <div className="hidden lg:block relative">
          {icon}
        </div>
        <div className="w-full">
          <div className="flex justify-between w-full items-center gap-4">
            <p className="text-lg lg:text-2xl text-primary font-bold">
              {title}
            </p>
            <div className="flex items-center gap-2">
              {seeAll && (
                <Link href={seeAll} legacyBehavior>
                  <a className="text-primary font-medium text-sm lg:text-base hover:text-secondary transition-all duration-200 mr-2">
                    See All
                  </a>
                </Link>
              )}
              {isPrev && (
                <button
                  className="w-8 h-8 text-xs rounded-full bg-zinc-200 dark:bg-zinc-700"
                  onClick={prev}
                  disabled={!isPrev}
                  aria-label="Previous"
                >
                  <FaChevronLeft />
                </button>
              )}
              {isNext && (
                <button
                  className="w-8 h-8 text-xs rounded-full bg-zinc-200 dark:bg-zinc-700"
                  onClick={next}
                  disabled={!isNext}
                  aria-label="Next"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>
          </div>

          <p className="text-sm lg:text-base text-gray-500 font-regular">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
