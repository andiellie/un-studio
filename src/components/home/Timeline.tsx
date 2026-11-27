"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  timeline,
  type TimelineChapter,
  type TimelineImage,
  type TimelineRow,
} from "@/data/timeline";
import ScrollShowcase from "./ScrollShowcase";

export type TimelineProps = Record<string, never>;

// Header is h-20 (80px) and sticky, so pinned layers sit right under it.
const PIN_TOP = "top-20";
const ease = [0.22, 1, 0.36, 1] as const;

// Image that wipes open when it enters the viewport and drifts against the
// scroll while it is on screen.
function ParallaxImage({ image, sizes }: { image: TimelineImage; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    // The observer sits on the figure: Chrome counts the image's own clip-path,
    // so a fully clipped element would never report as intersecting.
    <motion.figure initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      <motion.div
        ref={ref}
        variants={{
          hidden: reduceMotion ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" },
          show: reduceMotion ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" },
        }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
        className="relative overflow-hidden bg-black/5"
        style={{ aspectRatio: image.ratio }}
      >
        <motion.div
          style={reduceMotion ? undefined : { y }}
          className="absolute inset-x-0 -inset-y-[10%]"
        >
          <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" />
        </motion.div>
      </motion.div>
      <figcaption className="mt-3 text-sm text-black/70">{image.caption}</figcaption>
    </motion.figure>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Row({ row }: { row: TimelineRow }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // The rule above each row draws itself from the left as the row comes up.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const textCol = row.flip
    ? "md:col-span-4 md:col-start-8 md:row-start-1"
    : "md:col-span-4 md:col-start-2";
  const imageCol = row.flip
    ? "md:col-span-5 md:col-start-2 md:row-start-1"
    : "md:col-span-5 md:col-start-7";

  return (
    <div ref={ref} className="relative px-4 py-16 sm:px-8 md:py-24">
      <motion.div
        aria-hidden="true"
        style={{ scaleX: reduceMotion ? 1 : scaleX }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-black"
      />
      <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-8">
        <div className={`flex flex-col gap-6 ${textCol}`}>
          {row.small && (
            <ParallaxImage image={row.small} sizes="(min-width: 768px) 30vw, 100vw" />
          )}
          <Reveal>
            <p className="max-w-md text-base leading-relaxed text-pretty md:text-lg">{row.text}</p>
          </Reveal>
        </div>
        <div className={`${imageCol} ${row.flip ? "" : "md:mt-40"}`}>
          <ParallaxImage image={row.large} sizes="(min-width: 768px) 42vw, 100vw" />
        </div>
      </div>
    </div>
  );
}

function Chapter({ chapter }: { chapter: TimelineChapter }) {
  const introRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // From the band entering the screen to it pinning under the header.
  const { scrollYProgress: enter } = useScroll({
    target: introRef,
    offset: ["start end", "start start"],
  });
  // While the band is pinned and the strip slides up beneath it.
  const { scrollYProgress: pinned } = useScroll({
    target: introRef,
    offset: ["start start", "end start"],
  });
  const stripY = useTransform(pinned, [0, 1], ["-10%", "10%"]);
  const statementOpacity = useTransform(enter, [0.6, 1], [0, 1]);
  const statementY = useTransform(enter, [0.6, 1], [40, 0]);

  return (
    <article aria-labelledby={`chapter-${chapter.id}`}>
      <div ref={introRef} className="relative">
        {/* Band: a plain black title bar that pins under the header while the
            strip below scrolls up under it. */}
        <div className={`sticky ${PIN_TOP} z-20 bg-black px-4 py-5 text-white sm:px-8 md:py-6`}>
          <h2
            id={`chapter-${chapter.id}`}
            className="text-2xl font-medium tracking-tight md:text-4xl"
          >
            {chapter.label}
          </h2>
        </div>

        {/* Strip: cover image with the chapter statement. */}
        <div className="relative h-[55vh] overflow-hidden md:h-[80vh]">
          <motion.div
            style={reduceMotion ? undefined : { y: stripY }}
            className="absolute inset-x-0 -inset-y-[10%]"
          >
            <Image src={chapter.cover.src} alt={chapter.cover.alt} fill sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center px-6 pt-16 md:pt-20">
            <motion.p
              style={reduceMotion ? undefined : { opacity: statementOpacity, y: statementY }}
              className="max-w-3xl text-center text-2xl tracking-wide text-balance text-white md:text-4xl"
            >
              {chapter.statement}
            </motion.p>
          </div>
        </div>
      </div>

      {chapter.showcase && <ScrollShowcase {...chapter.showcase} />}

      {chapter.rows.map((row, i) => (
        <Row key={i} row={row} />
      ))}
    </article>
  );
}

export default function Timeline() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section ref={ref} aria-label="Lo que hacemos" className="relative -mx-4 mt-24 sm:-mx-8 md:mt-32">
      {/* Reading progress for the whole section, pinned under the header. */}
      <div className={`sticky ${PIN_TOP} z-30 h-0`}>
        <motion.div
          aria-hidden="true"
          style={{ scaleX: scrollYProgress }}
          className="h-0.5 w-full origin-left bg-white mix-blend-difference"
        />
      </div>
      {timeline.map((chapter) => (
        <Chapter key={chapter.id} chapter={chapter} />
      ))}
    </section>
  );
}
