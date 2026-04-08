import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ImageGallery({ images = [], className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className={`w-full overflow-hidden rounded-lg bg-zinc-800 ${className}`}>
        <img
          src={images[0]}
          alt="Project"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-lg bg-zinc-800 ${className}`}>
      {/* Images */}
      {images.map((image, index) => (
        <motion.img
          key={index}
          src={image}
          alt={`Project slide ${index + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ))}

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-6 bg-blue-400"
                : "w-2 bg-zinc-500 hover:bg-zinc-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-zinc-900/70 p-2 text-white transition hover:bg-zinc-900"
        aria-label="Previous image"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-zinc-900/70 p-2 text-white transition hover:bg-zinc-900"
        aria-label="Next image"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default ImageGallery;
