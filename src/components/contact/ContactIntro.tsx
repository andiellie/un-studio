"use client";

import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { site } from "@/data/site";
import { ArrowIcon } from "@/components/layout/Header";
import ContactForm, {
  labelClass,
  primaryButtonClass,
  stepHeadingClass,
  textLinkClass,
} from "./ContactForm";

export type ContactIntroProps = Record<string, never>;

// Links ending in this hash (e.g. the footer CTA) skip the intro and open the form.
export const FORM_HASH = "#proyecto";

const HEADING = "¿Qué tienes en mente?";
const HEADING_WORDS = HEADING.split(" ");

export default function ContactIntro() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === FORM_HASH);
    sync();
    // Next's <Link> updates the hash with pushState, which fires no hashchange,
    // so also catch clicks on links to the form (e.g. the footer CTA on this page).
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.(`a[href$="${FORM_HASH}"]`);
      if (link) setOpen(true);
    };
    window.addEventListener("hashchange", sync);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", sync);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const start = () => {
    // Updates the URL so "back" returns to the intro.
    window.location.hash = FORM_HASH;
  };

  const fade = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -16 },
      };

  const socials = site.socials.filter((s) => s.href !== site.whatsappHref);

  // Load-in choreography: heading words rise out of a mask one by one, then the
  // subtitle, actions and socials fade up in sequence. Reduced motion: fades only.
  const ease = [0.22, 1, 0.36, 1] as const;
  const section: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: 0.1 } },
    exit: { opacity: 0, y: reduceMotion ? 0 : -16, transition: { duration: 0.3 } },
  };
  const word: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { y: "110%" },
    show: { y: 0, opacity: 1, transition: { duration: 0.7, ease } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.div key="form" {...fade} transition={{ duration: 0.45, ease }}>
          <ContactForm />
        </motion.div>
      ) : (
        <motion.section
          key="intro"
          variants={section}
          initial="hidden"
          animate="show"
          exit="exit"
          // Same layout, type and voice as the form steps (ContactForm), so the
          // intro reads as step zero of the same flow.
          className="mx-auto max-w-3xl"
        >
          <div className="flex flex-col gap-4">
            <motion.h1
              variants={{ show: { transition: { staggerChildren: reduceMotion ? 0 : 0.07 } } }}
              aria-label={HEADING}
              className={stepHeadingClass}
            >
              {HEADING_WORDS.map((w, i) => (
                <Fragment key={i}>
                  {/* Mask: the word slides up from below its own line. */}
                  <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <motion.span variants={word} className="inline-block">
                      {w}
                    </motion.span>
                  </span>
                  {i < HEADING_WORDS.length - 1 && " "}
                </Fragment>
              ))}
            </motion.h1>
            <motion.p variants={item} className={labelClass}>
              no necesitas tenerlo todo claro, te guiamos paso a paso
            </motion.p>
          </div>

          <motion.div variants={item} className="mt-12 flex flex-wrap items-center gap-6">
            <button type="button" onClick={start} className={primaryButtonClass}>
              empieza tu proyecto
            </button>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${textLinkClass} group inline-flex items-center gap-1.5`}
            >
              o escríbenos por WhatsApp
              {/* Corner arrow slides in on hover/focus (external link cue). */}
              <ArrowIcon className="size-4 -translate-x-1 translate-y-1 opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0" />
            </a>
          </motion.div>

          {socials.length > 0 && (
            <motion.ul variants={item} className="mt-16 flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${textLinkClass} text-black/50 hover:text-black`}
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </motion.ul>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
