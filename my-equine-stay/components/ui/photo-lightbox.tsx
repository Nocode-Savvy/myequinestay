"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";

export interface LightboxPhoto {
  id?: string;
  url: string;
  caption?: string;
}

interface PhotoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  photos: LightboxPhoto[];
  initialIndex?: number;
  title?: string;
}

export function PhotoLightbox({
  isOpen,
  onClose,
  photos,
  initialIndex = 0,
  title,
}: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Sync initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext(); // swiped left
      } else {
        handlePrev(); // swiped right
      }
    }
    touchStartX.current = null;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 text-white z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-semibold tracking-wider px-3 py-1 rounded-full bg-white/10 text-white border border-white/10">
              {currentIndex + 1} / {photos.length}
            </span>
            {title && (
              <span className="text-xs sm:text-sm text-neutral-300 truncate max-w-[200px] sm:max-w-md hidden sm:inline">
                {title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="size-4 sm:size-5" />
              ) : (
                <Maximize2 className="size-4 sm:size-5" />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="size-5 sm:size-6" />
            </button>
          </div>
        </div>

        {/* Main image stage */}
        <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-14 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xl"
            >
              <ChevronLeft className="size-6 sm:size-7" />
            </button>
          )}

          <div className="relative w-full h-full max-w-6xl max-h-[75vh] flex items-center justify-center">
            <motion.div
              key={currentPhoto.url}
              initial={{ opacity: 0.2, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.caption || title || `Photo ${currentIndex + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 size-11 sm:size-14 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xl"
            >
              <ChevronRight className="size-6 sm:size-7" />
            </button>
          )}
        </div>

        {/* Bottom thumbnail strip */}
        {photos.length > 1 && (
          <div className="p-3 sm:p-4 bg-black/60 border-t border-white/10 overflow-x-auto flex items-center justify-center gap-2 sm:gap-3 z-10">
            <div className="flex gap-2 sm:gap-3 mx-auto px-2">
              {photos.map((photo, idx) => (
                <button
                  key={photo.id || idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-14 h-10 sm:w-20 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    idx === currentIndex
                      ? "ring-2 ring-[#E1B534] scale-105 opacity-100 shadow-md"
                      : "opacity-40 hover:opacity-80"
                  }`}
                  aria-label={`Jump to photo ${idx + 1}`}
                >
                  <Image
                    src={photo.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
