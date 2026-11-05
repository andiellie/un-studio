"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import ContactForm from "./ContactForm";

export type ContactIntroProps = Record<string, never>;

// Links ending in this hash (e.g. the footer CTA) skip the intro and open the form.
export const FORM_HASH = "#proyecto";

const primaryButtonClass =
  "group inline-flex items-center gap-3 rounded-full bg-black px-7 py-3.5 text-base font-medium tracking-tight text-white transition-colors duration-200 hover:bg-[#FFE600] hover:text-black";

const secondaryButtonClass =
  "inline-flex items-center gap-3 rounded-full border border-black/20 px-7 py-3.5 text-base font-medium tracking-tight transition-colors duration-200 hover:border-black hover:bg-black hover:text-white";

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

  return (
    <AnimatePresence mode="wait" initial={false}>
      {open ? (
        <motion.div key="form" {...fade} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <ContactForm />
        </motion.div>
      ) : (
        <motion.section
          key="intro"
          {...fade}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl py-8 sm:py-16"
        >
          <h1 className="text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            ¿Qué creamos
            <br />
            junt@s?
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-black/60 sm:text-lg">
            Una pieza a medida, tu identidad de marca o tus redes. No necesitas
            tenerlo todo claro: te guiamos con unas preguntas cortas.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={start} className={primaryButtonClass}>
              Empieza tu proyecto
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryButtonClass}
            >
              Escríbenos por WhatsApp
            </a>
          </div>

          {socials.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-2 text-base tracking-tight sm:text-lg">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/60 underline-offset-4 transition-colors duration-200 hover:text-black hover:underline"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
