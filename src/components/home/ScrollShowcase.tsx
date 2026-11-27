"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

export type ShowcaseImage = { src: string; alt: string };

export type ScrollShowcaseProps = {
  // Starts covering the screen, then shrinks to a card.
  center: ShowcaseImage;
  // Revealed on the left of the center card.
  before: ShowcaseImage;
  // Revealed on the right; the first one appears with `before`, the rest
  // come in as the row slides left.
  after: ShowcaseImage[];
};

// Card size: 62% of the stage height, capped at 70vw wide on phones.
const cardClass =
  "relative aspect-[4/5] h-[min(62%,calc(70vw*1.25))] shrink-0 overflow-hidden bg-neutral-100";

// Scroll phases (fractions of the pinned scroll distance):
// 0-30% zoom out, 30-60% side cards reveal, 60-100% the row slides left.
const SHRINK_END = 0.3;
const REVEAL_END = 0.6;
const SLIDE_START = 0.6;
// Center card's starting scale.
const START_SCALE = 1.5;

// Side cards fade in and close the gap toward the center card.
function SideCard({
  image,
  side,
  progress,
}: {
  image: ShowcaseImage;
  side: -1 | 1;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [SHRINK_END, REVEAL_END], [0, 1]);
  // Slides in from its own side.
  const x = useTransform(progress, [SHRINK_END, REVEAL_END], [side * 80, 0]);
  return (
    <motion.figure style={{ opacity, x }} className={`${cardClass} will-change-[transform,opacity]`}>
      <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 30vw, 60vw" className="object-cover" />
    </motion.figure>
  );
}

// Pinned scroll scene: one image zooms out from 1.5x to a card, a card
// appears on each side, then the row slides left like a scroll-driven carousel.
// Modeled on the heritage carousel at rimowa.com, written from scratch.
export default function ScrollShowcase({ center, before, after }: ScrollShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [m, setM] = useState({ start: 0, end: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const card = centerRef.current;
      const row = rowRef.current;
      if (!stage || !card || !row) return;
      const W = stage.clientWidth;
      // offsetLeft/Width ignore transforms, so these are the resting positions.
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const margin = Math.min(64, W * 0.05);
      setM({
        // Row offset that puts the center card in the middle of the screen...
        start: W / 2 - cardCenter,
        // ...and the one that brings the last card to the right margin.
        end: Math.min(W / 2 - cardCenter, W - margin - row.scrollWidth),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (stageRef.current) observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress: p } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const scale = useTransform(p, [0, SHRINK_END], [START_SCALE, 1]);
  const x = useTransform(p, [SLIDE_START, 1], [m.start, m.end]);
  // Cards beyond the first on the right stay hidden until the slide starts.
  const restOpacity = useTransform(p, [SLIDE_START, SLIDE_START + 0.06], [0, 1]);

  if (reduceMotion) {
    return (
      <div className="flex h-[60svh] gap-4 overflow-x-auto px-4 py-16 sm:px-8">
        {[before, center, ...after].map((image) => (
          <figure key={image.src} className={cardClass}>
            <Image src={image.src} alt={image.alt} fill sizes="60vw" className="object-cover" />
          </figure>
        ))}
      </div>
    );
  }

  const [firstAfter, ...restAfter] = after;

  return (
    // Tall track = how long the scene stays pinned while it plays.
    <div ref={trackRef} className="h-[300svh]">
      <div
        ref={stageRef}
        className="sticky top-20 h-[calc(100svh-5rem)] overflow-hidden bg-white"
      >
        <motion.div
          ref={rowRef}
          style={{ x }}
          className="absolute top-0 left-0 flex h-full items-center gap-4 will-change-transform md:gap-6"
        >
          <SideCard image={before} side={-1} progress={p} />
          <motion.figure
            ref={centerRef}
            style={{ scale }}
            className={`${cardClass} z-10 origin-center will-change-transform`}
          >
            <Image
              src={center.src}
              alt={center.alt}
              fill
              // Shown at 1.5x at the start.
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.figure>
          {firstAfter && <SideCard image={firstAfter} side={1} progress={p} />}
          {restAfter.map((image) => (
            <motion.figure key={image.src} style={{ opacity: restOpacity }} className={cardClass}>
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 30vw, 60vw" className="object-cover" />
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
