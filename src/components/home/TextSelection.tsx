"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";

export type TextSelectionProps = {
  text: string;
  // How many leading characters get the red "spellcheck" underline.
  underlineChars?: number;
  // Seconds before the cursor shows up.
  delay?: number;
};

type Phase = "waiting" | "approach" | "dragging" | "selected";

const humanEase = [0.45, 0.05, 0.55, 0.95] as const;

function ArrowCursor() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[1.1em] drop-shadow-sm">
      <path
        d="M4 2.5v17.2l4.6-4.4 3 6.6 3-1.4-3-6.4h6.3z"
        fill="#fff"
        stroke="#000"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TextSelection({ text, underlineChars = 0, delay = 1.2 }: TextSelectionProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dragging = useRef(false);
  const [edges, setEdges] = useState<number[]>([]);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("waiting");
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const chars = Array.from(text);
  const ready = edges.length > 0;

  // Right edge of every character, relative to the start of the text.
  useLayoutEffect(() => {
    const measure = () => {
      const left = wrapperRef.current?.getBoundingClientRect().left ?? 0;
      setEdges(charRefs.current.map((el) => (el ? el.getBoundingClientRect().right - left : 0)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  // Like a real editor: a character is selected once the cursor passes its midpoint.
  useMotionValueEvent(x, "change", (latest) => {
    if (!dragging.current) return;
    let selected = 0;
    edges.forEach((right, i) => {
      const left = i > 0 ? edges[i - 1] : 0;
      if (latest > (left + right) / 2) selected = i + 1;
    });
    setCount(selected);
  });

  useEffect(() => {
    if (!ready) return;
    const end = edges[edges.length - 1];

    if (reduceMotion) {
      x.set(end + 10);
      y.set(26);
      return;
    }

    let cancelled = false;
    const running: AnimationPlaybackControls[] = [];
    const run = (control: AnimationPlaybackControls) => {
      running.push(control);
      return control;
    };
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    (async () => {
      x.set(end * 0.35 + 60);
      y.set(70);
      await wait(delay * 1000);
      if (cancelled) return;

      // Travel to the start of the word, slowing down on arrival.
      setPhase("approach");
      await Promise.all([
        run(animate(x, -1, { duration: 0.8, ease: [0.25, 1, 0.5, 1] })),
        run(animate(y, 0, { duration: 0.8, ease: [0.25, 1, 0.5, 1] })),
      ]);
      await wait(260);
      if (cancelled) return;

      // Press and drag: uneven speed and a slight hand wobble.
      setPhase("dragging");
      dragging.current = true;
      await Promise.all([
        run(animate(x, end + 2, { duration: 1.3, ease: humanEase })),
        run(animate(y, [0, 1.5, -1, 1, 0], { duration: 1.3, ease: "easeInOut" })),
      ]);
      dragging.current = false;
      if (cancelled) return;
      setCount(edges.length);
      await wait(180);
      if (cancelled) return;

      // Release: handles appear and the cursor drifts away.
      setPhase("selected");
      run(animate(x, end + 10, { duration: 0.6, ease: "easeOut" }));
      run(animate(y, 26, { duration: 0.6, ease: "easeOut" }));
    })();

    return () => {
      cancelled = true;
      dragging.current = false;
      running.forEach((control) => control.stop());
    };
    // Runs once the text has been measured; resizes only update `edges`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reduceMotion]);

  // With reduced motion, skip straight to the finished selection.
  const shownCount = reduceMotion ? edges.length : count;
  const shownPhase: Phase = reduceMotion && ready ? "selected" : phase;
  const highlightWidth = shownCount > 0 ? edges[shownCount - 1] : 0;
  const showHandles = shownPhase === "selected";

  return (
    <span ref={wrapperRef} className="relative whitespace-nowrap">
      <span className="sr-only">{text}</span>

      <span
        aria-hidden="true"
        className="absolute -inset-y-0.5 left-0 -z-10 bg-sky-200/80"
        style={{ width: highlightWidth }}
      />

      {showHandles && (
        <span aria-hidden="true">
          <motion.span
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute -top-1.5 left-0 h-[calc(100%+6px)] w-0.5 origin-bottom -translate-x-1/2 bg-sky-500"
          >
            <span className="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-sky-500" />
          </motion.span>
          <motion.span
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
            className="absolute top-0 h-[calc(100%+6px)] w-0.5 origin-top -translate-x-1/2 bg-sky-500"
            style={{ left: highlightWidth }}
          >
            <span className="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-sky-500" />
          </motion.span>
        </span>
      )}

      {chars.map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          ref={(el) => {
            charRefs.current[i] = el;
          }}
          className={
            i < underlineChars
              ? "underline decoration-red-500 decoration-dashed decoration-2 underline-offset-[6px]"
              : undefined
          }
        >
          {char}
        </span>
      ))}

      {/* Always mounted: mounting it mid-animation would stop the x/y motion values. */}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ opacity: shownPhase === "waiting" ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        style={{ x, y }}
        className="absolute top-1/2 left-0"
      >
        <span className="absolute top-0 left-0 -translate-x-[18%] -translate-y-[10%]">
          <ArrowCursor />
        </span>
      </motion.span>
    </span>
  );
}
