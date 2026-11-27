"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type BackToTopProps = Record<string, never>;

// Shows once the visitor has scrolled this far.
const SHOW_AFTER = 600;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
          // The button is rotated 180deg, so a negative y moves it down on screen.
          initial={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          // Vertical, flush against the scrollbar: vertical-rl + rotate-180 makes
          // the text read bottom to top, with the arrow at the top.
          // White + difference blend: reads as black on light sections and
          // white over the black footer and dark timeline bands.
          className="group fixed right-0 bottom-8 z-40 inline-flex rotate-180 items-center gap-1.5 px-1 font-serif text-xl leading-none text-white italic mix-blend-difference [writing-mode:vertical-rl]"
        >
          back to top
          {/* Counter-rotated so it points up; translate runs in the rotated frame,
              so +y moves it up on hover. */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-4 rotate-180 transition-[translate] duration-200 group-hover:translate-y-1 motion-reduce:transition-none"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
