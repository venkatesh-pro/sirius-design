import React, { useEffect, useState, useRef } from "react";

interface SliderProps {
  sliderImages: string[];
}

const Slider: React.FC<SliderProps> = ({ sliderImages }) => {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false); // Track if a drag is happening

  // Adjust active index if the sliderImages array length changes
  useEffect(() => {
    setActive((prevActive) =>
      prevActive >= sliderImages.length ? sliderImages.length - 1 : prevActive
    );
  }, [sliderImages]);

  if (!sliderImages || sliderImages.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        No images available
      </div>
    );
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true; // Mark as dragging
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      // Swipe left
      setActive((prevActive) =>
        prevActive + 1 >= sliderImages.length ? 0 : prevActive + 1
      );
    } else if (diff < -50) {
      // Swipe right
      setActive((prevActive) =>
        prevActive - 1 < 0 ? sliderImages.length - 1 : prevActive - 1
      );
    }
    isDragging.current = false; // Reset dragging state
  };

  const handleButtonTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation(); // Prevent touch event from bubbling to the slider
  };

  const translateValue = `translateX(-${active * 100}%)`;

  return (
    <div
      className="slider relative w-full h-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="list flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: translateValue }}
      >
        {sliderImages.map((image, i) => (
          <div
            key={i}
            className="item flex-shrink-0 w-full h-full flex items-center justify-center"
          >
            <img
              src={image}
              alt={`Slide ${i}`}
              className="object-cover w-full h-full"
              width={1000}
              height={1000}
            />
          </div>
        ))}
      </div>
      {sliderImages.length > 1 && (
        <div className="buttons absolute top-1/2 left-[5%] transform -translate-y-1/2 w-[90%] flex justify-between items-center">
          <button
            onClick={() =>
              setActive((prevActive) =>
                prevActive - 1 < 0 ? sliderImages.length - 1 : prevActive - 1
              )
            }
            onTouchStart={handleButtonTouchStart} // Stop touch propagation
            className="w-[28px] h-[28px] rounded-full bg-[#FFFFFF] cursor-pointer flex items-center justify-center backdrop-blur-[2xl]"
          >
            <img
              src="/images/left-arrow.svg"
              className="w-[6.82px] h-[11.8px]"
              alt="Previous"
            />
          </button>

          <button
            onClick={() =>
              setActive((prevActive) =>
                prevActive + 1 >= sliderImages.length ? 0 : prevActive + 1
              )
            }
            onTouchStart={handleButtonTouchStart} // Stop touch propagation
            className="w-[28px] h-[28px] rounded-full bg-[#FFFFFF] cursor-pointer flex items-center justify-center backdrop-blur-2xl"
          >
            <img
              src="/images/left-arrow.svg"
              className="w-[6.82px] h-[11.8px] rotate-180"
              alt="Next"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Slider;
