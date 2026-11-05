import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export type FooterProps = Record<string, never>;

const pillClass =
  "group inline-flex items-center gap-3 rounded-full border border-white/40 px-4 py-2.5 text-xs font-medium sm:px-5 sm:py-3 sm:text-sm tracking-tight transition-colors duration-200 hover:border-white hover:bg-white hover:text-black";

export default function Footer() {
  return (
    <footer className="flex bg-black text-white">
      {/* Vertical wordmark on the left. Its top lines up with the cap height of
          the "Trabajemos" heading: content top padding + line-box-to-cap-top
          offset, measured in the browser:
          phone   64px + 5px  (text-4xl)
          sm/md   80px + 9px  (text-6xl)
          lg+     80px + 11px (text-7xl) */}
      <Link
        href="/"
        aria-label={`${site.name}, inicio`}
        className="shrink-0 self-start px-4 pt-[69px] pb-16 sm:px-8 sm:pt-[89px] sm:pb-20 lg:px-10 lg:pt-[91px]"
      >
        <Image
          src="/logos/unstudio-wordmark-vertical.png"
          alt={site.name}
          width={744}
          height={2182}
          sizes="(min-width: 1024px) 144px, (min-width: 640px) 112px, 48px"
          // Sized by height so the whole wordmark always fits in the viewport:
          // capped at 100svh minus the fixed header (5rem) and breathing room.
          className="h-[min(140px,calc(100svh-12rem))] w-auto invert sm:h-[min(328px,calc(100svh-12rem))] lg:h-[min(422px,calc(100svh-12rem))]"
        />
      </Link>

      <div className="mx-auto min-w-0 max-w-screen-2xl flex-1 px-4 pt-16 sm:px-8 sm:pt-20">
        {/* Grid: on md+ the socials share the heading's row and span its full
            height, so their top and bottom line up with the two heading lines. */}
        <div className="grid gap-x-16 gap-y-10 md:grid-cols-[1fr_auto]">
          <h2 className="text-4xl leading-[1.05] font-medium tracking-tight sm:text-6xl lg:text-7xl">
            {site.tagline[0]}
            <br />
            {site.tagline[1]}
          </h2>

          <ul className="order-last flex flex-col gap-1 text-lg tracking-tight sm:text-xl md:order-none md:col-start-2 md:row-start-1 md:min-w-48 md:justify-between md:py-[0.35em] lg:text-2xl">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <Link href={site.bookingHref} className={pillClass}>
              Empieza tu proyecto
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className={pillClass}>
              Escríbenos
              <span aria-hidden="true">@</span>
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 py-8 sm:mt-20 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.name}</p>
          <nav aria-label="Footer" className="flex gap-6">
            <Link href="/" className="transition-colors duration-200 hover:text-white">
              Inicio
            </Link>
            <Link href="/about" className="transition-colors duration-200 hover:text-white">
              Nosotros
            </Link>
            <Link href="/contact" className="transition-colors duration-200 hover:text-white">
              Contacto
            </Link>
            <Link href="/legal" className="transition-colors duration-200 hover:text-white">
              Legal
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
