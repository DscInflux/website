import React, { ReactNode, useState } from "react";
import MCarousel, { CarouselProps } from "react-multi-carousel";

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

  function next() {
    // pass 1 slide by default
    carousel?.next(1);
  }
  function prev() {
    // pass 1 slide by default
    carousel?.previous(1);
  }

  return (
    <>
      {header && header(next, prev, isPrev, isNext)}
      <MCarousel
        responsive={{
          desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3, slidesToSlide: 3 },
          tablet: { breakpoint: { max: 1024, min: 600 }, items: 2, slidesToSlide: 2 },
          mobile: { breakpoint: { max: 600, min: 0 }, items: 1, slidesToSlide: 1 },
        }}
        swipeable={true}
        draggable={true}
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
        containerClass="-mr-4"
      >
        {children(slides).map((child, index) => (
          <div key={index} className="flex-shrink-0 w-full select-none pr-4">
            {child}
          </div>
        ))}
      </MCarousel>
    </>
  );
};

export default Carousel;
