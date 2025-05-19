"use client";

import React, { ReactNode, useState } from "react";
import MCarousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface CarouselPropsCustom<T> {
  header?: (
    next: () => void,
    prev: () => void,
    isPrev: boolean,
    isNext: boolean
  ) => ReactNode;
  children: (slides: T[]) => ReactNode[];
  slides: T[];
}

const Carousel = <T,>({ header, children, slides }: CarouselPropsCustom<T>) => {
  const [carousel, setCarousel] = useState<MCarousel | null>(null);
  const [isNext, setIsNext] = useState(true);
  const [isPrev, setIsPrev] = useState(false);

  const next = () => carousel?.next(1);
  const prev = () => carousel?.previous(1);

  return (
    <>
      {header?.(next, prev, isPrev, isNext)}

      <MCarousel
        responsive={{
          desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
          tablet: { breakpoint: { max: 1024, min: 600 }, items: 2 },
          mobile: { breakpoint: { max: 600, min: 0 }, items: 1 },
        }}
        swipeable
        draggable
        showDots={false}
        arrows={false}
        ssr={false}
        ref={(el) => setCarousel(el)}
        afterChange={() => {
          if (!carousel) return;
          const { currentSlide, slidesToShow, totalItems } = carousel.state;
          setIsNext(currentSlide + slidesToShow < totalItems);
          setIsPrev(currentSlide > 0);
        }}
        containerClass=""
      >
        {children(slides).map((child, index) => (
          <div key={index} className="inline-block pr-4 h-full">
            {child}
          </div>
        ))}
      </MCarousel>
    </>
  );
};

export default Carousel;
