"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { heroCards, type HeroCard } from "@/data/hero";
import TextSelection from "./TextSelection";

export type HeroProps = Record<string, never>;

// Position, size and aspect for each card, matched by index to heroCards.
// Mobile keeps the cards in the corners so the center stays clear for the text.
const layout = [
  "left-[2%] top-[2%] w-[34%] aspect-[3/4] md:left-[7%] md:top-[8%] md:w-[19%] md:aspect-[3/4.2]",
  "hidden md:flex md:left-[24%] md:top-[30%] md:w-[10%] md:aspect-[3/4]",
  "left-[4%] bottom-[2%] w-[30%] aspect-square md:left-[3%] md:top-[47%] md:bottom-auto md:w-[15%] md:aspect-[4/3.6]",
  "hidden md:flex md:left-[15%] md:top-[64%] md:w-[19%] md:aspect-[4/2.9]",
  "right-[2%] top-[2%] w-[30%] aspect-[3/4] md:right-[3%] md:top-[4%] md:w-[15%] md:aspect-[3/3.4]",
  "hidden md:flex md:right-[14%] md:top-[20%] md:w-[18%] md:aspect-[4/2.8]",
  "hidden md:flex md:right-[6%] md:top-[40%] md:w-[19%] md:aspect-[4/4]",
  "right-[3%] bottom-[2%] w-[32%] aspect-[3/3.4] md:right-[3%] md:top-[64%] md:bottom-auto md:w-[12%] md:aspect-[3/4.2]",
];

const baseZ = [10, 5, 20, 30, 10, 20, 5, 30];

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
  constraintsRef,
}: {
  card: HeroCard;
  index: number;
  className: string;
  zIndex: number;
  onFocus: () => void;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
}) {
  const reduceMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const delay = revealStart + revealOrder.indexOf(index) * revealStep;

  return (
    <motion.figure
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      dragElastic={0.1}
      onPointerEnter={onFocus}
      onPointerDown={onFocus}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      whileDrag={{ scale: 1.03, rotate: index % 2 ? 1.5 : -1.5 }}
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
      className={`absolute flex cursor-grab touch-none flex-col overflow-hidden rounded-xl bg-[#e4e3e6] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] select-none active:cursor-grabbing md:rounded-2xl ${className}`}
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
            sizes="(min-width: 768px) 20vw, 35vw"
            onLoad={() => setLoaded(true)}
            className={`pointer-events-none object-cover transition-[opacity,scale] duration-700 ease-out ${
              loaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          />
        )}
      </motion.div>
    </motion.figure>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
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
      ref={containerRef}
      className="relative -mx-4 -mt-24 min-h-[640px] overflow-hidden sm:-mx-8 sm:-mt-32 md:h-[calc(100svh-5rem)] md:min-h-[720px]"
    >
      {heroCards.map((card, i) => (
        <WindowCard
          key={card.id}
          card={card}
          index={i}
          className={layout[i] ?? "hidden"}
          zIndex={zOrder[i] ?? 1}
          onFocus={() => bringToFront(i)}
          constraintsRef={containerRef}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 z-[35] flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-[min(70vw,420px)] md:w-[clamp(280px,23vw,440px)]"
        >
          <Image
            src="/logos/unstudio-wordmark.png"
            alt="unstudio"
            width={2182}
            height={744}
            priority
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
