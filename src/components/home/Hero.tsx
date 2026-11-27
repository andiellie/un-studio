"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { heroCards, type HeroCard } from "@/data/hero";
import TextSelection from "./TextSelection";

export type HeroProps = Record<string, never>;

// Position, size and aspect for each card, matched by index to heroCards.
// Breakpoints: phone (<768) and tablet (md) keep 4 windows in the corners;
// laptop and up (lg, 1024+) show all 8 around the text.
const layout = [
  "left-[2%] top-[2%] w-[34%] aspect-[3/4] md:w-[22%] lg:left-[7%] lg:top-[8%] lg:w-[19%] lg:aspect-[3/4.2]",
  "hidden lg:flex lg:left-[24%] lg:top-[30%] lg:w-[10%] lg:aspect-[3/4]",
  "left-[4%] bottom-[2%] w-[30%] aspect-square md:w-[20%] lg:left-[3%] lg:top-[47%] lg:bottom-auto lg:w-[15%] lg:aspect-[4/3.6]",
  "hidden lg:flex lg:left-[15%] lg:top-[64%] lg:w-[19%] lg:aspect-[4/2.9]",
  "right-[2%] top-[2%] w-[30%] aspect-[3/4] md:w-[20%] lg:right-[3%] lg:top-[4%] lg:w-[15%] lg:aspect-[3/3.4]",
  "hidden lg:flex lg:right-[14%] lg:top-[20%] lg:w-[18%] lg:aspect-[4/2.8]",
  "hidden lg:flex lg:right-[6%] lg:top-[40%] lg:w-[19%] lg:aspect-[4/4]",
  "right-[3%] bottom-[2%] w-[32%] aspect-[3/3.4] md:w-[20%] lg:right-[3%] lg:top-[64%] lg:bottom-auto lg:w-[12%] lg:aspect-[3/4.2]",
];

const baseZ = [10, 5, 20, 30, 10, 20, 5, 30];

// Cards shown on phone and tablet too (see layout: the others are hidden below lg).
const alwaysVisible = [0, 2, 4, 7];

// Order in which the windows open on load, alternating sides (values are card indexes).
const revealOrder = [0, 4, 2, 7, 1, 5, 3, 6];
const revealStart = 0.35;
const revealStep = 0.14;
// When the last window has opened; the text selection starts after this.
const revealEnd = revealStart + revealStep * revealOrder.length + 0.4;

function WindowCard({
  card,
  index,
  className,
  zIndex,
  onFocus,
}: {
  card: HeroCard;
  index: number;
  className: string;
  zIndex: number;
  onFocus: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const delay = revealStart + revealOrder.indexOf(index) * revealStep;

  return (
    <motion.figure
      // Hovered card comes to the front so its 10% growth isn't hidden.
      onPointerEnter={onFocus}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.6, y: 24, rotate: index % 2 ? 4 : -4 }
      }
      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
      transition={
        reduceMotion
          ? { duration: 0.4, delay: delay * 0.5 }
          : {
              opacity: { duration: 0.25, delay },
              default: { type: "spring", stiffness: 260, damping: 20, delay },
            }
      }
      style={{ zIndex }}
      // Hover grow uses the CSS `scale` property (Tailwind v4), separate from the
      // `transform` framer-motion writes for the entrance, so the two never clash
      // and the card shrinks back right away without replaying the entrance delay.
      className={`absolute flex flex-col overflow-hidden rounded-xl bg-[#e4e3e6] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] transition-[scale] duration-300 ease-out select-none hover:scale-110 motion-reduce:hover:scale-100 md:rounded-2xl ${className}`}
    >
      <figcaption className="shrink-0 px-3 py-1.5 text-[10px] font-semibold tracking-tight md:text-xs">
        {card.title}
      </figcaption>
      <motion.div
        initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 0.7, delay: delay + 0.2, ease: [0.65, 0, 0.35, 1] }}
        className="relative min-h-0 flex-1"
        style={{ backgroundColor: card.tint }}
      >
        {card.src && (
          <Image
            src={card.src}
            alt={card.alt}
            fill
            draggable={false}
            // Cards visible at every breakpoint fetch right away; the rest stay lazy
            // so phones (where they're display:none) never download them.
            // The first card is the LCP element on desktop.
            loading={alwaysVisible.includes(index) ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 22vw, 35vw"
            className="pointer-events-none object-cover"
          />
        )}
      </motion.div>
    </motion.figure>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [zOrder, setZOrder] = useState(baseZ);

  const bringToFront = (index: number) => {
    setZOrder((prev) => {
      if (prev[index] === Math.max(...prev)) return prev;
      const top = Math.max(...prev) + 1;
      return prev.map((z, i) => (i === index ? top : z));
    });
  };

  return (
    <section
      className="relative -mx-4 -mt-24 min-h-[640px] overflow-hidden sm:-mx-8 sm:-mt-32 md:min-h-[820px] lg:h-[calc(100svh-5rem)] lg:min-h-[720px]"
    >
      {/* Own stacking context: however high bringToFront pushes a card's
          z-index, it can never rise above the text layer. */}
      <div className="absolute inset-0 isolate z-0">
        {heroCards.map((card, i) => (
          <WindowCard
            key={card.id}
            card={card}
            index={i}
            className={layout[i] ?? "hidden"}
            zIndex={zOrder[i] ?? 1}
            onFocus={() => bringToFront(i)}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-[min(70vw,420px)] md:w-[min(50vw,420px)] lg:w-[clamp(280px,23vw,440px)]"
        >
          <Image
            src="/logos/unstudio-wordmark.png"
            alt="unstudio"
            width={2182}
            height={744}
            preload
            // Matches the h1 width below; stops Next from serving the 3840px file.
            sizes="(min-width: 1024px) 440px, (min-width: 768px) 50vw, 70vw"
            className="h-auto w-full"
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 max-w-2xl text-lg leading-snug tracking-tight text-balance sm:text-2xl 2xl:text-3xl"
        >
          unstudio es un estudio creativo de mobiliario, identidad de marca y presencia digital.
          <br />
          <TextSelection text="Diseñamos con criterio." delay={revealEnd} />
        </motion.p>
      </div>
    </section>
  );
}
