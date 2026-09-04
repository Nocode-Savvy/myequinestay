"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollToTop({ className = "" }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.25 }}
          className={`fixed z-40 ${className || "bottom-20 right-5 sm:bottom-20 sm:right-6"}`}
        >
          {/* Glowing pulse aura ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[#E1B534]/40 -z-10"
            animate={{
              scale: [1, 1.45, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Bouncy interactive button */}
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            title="Scroll to top"
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.12, y: -8 }}
            whileTap={{ scale: 0.9 }}
            className="group relative flex size-11 items-center justify-center rounded-full bg-gradient-to-tr from-[#C8922A] via-[#E1B534] to-[#F5D884] text-[#1B221E] shadow-[0_4px_20px_rgba(225,181,52,0.45)] ring-2 ring-white/80 hover:shadow-[0_6px_25px_rgba(225,181,52,0.65)] transition-shadow"
          >
            <ArrowUp
              size={20}
              className="stroke-[2.5] text-[#1B221E] transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
