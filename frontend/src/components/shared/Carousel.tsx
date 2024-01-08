import React, { useState } from "react";

interface CarouselProps {
  photos: {
    id: number;
    url: string;
  }[];
}

const Carousel: React.FC<CarouselProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  if (photos.length === 1) {
    // If there is only one photo, don't render the carousel buttons
    return (
      <div className="relative w-full" data-carousel="slide">
        <div className="relative aspect-w-1 aspect-h-1 h-56 overflow-hidden rounded-lg md:h-96">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`duration-700 ease-in-out absolute w-full h-full transform ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={photo.url}
                className="absolute block w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="default-carousel" className="relative w-full" data-carousel="slide">
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`duration-700 ease-in-out absolute w-full h-full transform ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={photo.url}
              className="absolute block w-full h-full object-cover"
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {photos.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
            aria-current={currentIndex === index}
            aria-label={`Slide ${index + 1}`}
            data-carousel-slide-to={index}
          />
        ))}
      </div>
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={prevImage}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
        onClick={nextImage}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Carousel;
