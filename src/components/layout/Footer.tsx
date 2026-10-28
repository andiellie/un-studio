import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export type FooterProps = Record<string, never>;

const pillClass =
  "group inline-flex items-center gap-3 rounded-full border border-white/40 px-5 py-3 text-xs font-medium tracking-wide uppercase transition-colors duration-200 hover:border-white hover:bg-white hover:text-black";

export default function Footer() {
  const emailHref = site.email ? `mailto:${site.email}` : "/about#contact";

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-screen-2xl px-4 pt-24 sm:px-8 sm:pt-32">
        <div className="flex flex-col gap-16 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl lg:text-7xl">
              {site.tagline[0]}
              <br />
              {site.tagline[1]}
            </h2>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={site.bookingHref} className={pillClass}>
                Book a call
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <a href={emailHref} className={pillClass}>
                Drop us an email
                <span aria-hidden="true">@</span>
              </a>
            </div>
          </div>

          <ul className="flex flex-col gap-1 text-xl tracking-tight md:min-w-48">
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
        </div>

        <Link href="/" aria-label={`${site.name}, inicio`} className="mt-24 block sm:mt-32">
          <Image
            src="/logos/unstudio-wordmark.png"
            alt={site.name}
            width={2182}
            height={744}
            sizes="100vw"
            className="h-auto w-full invert"
          />
        </Link>

        <div className="flex flex-col gap-2 py-8 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.name}</p>
          <nav aria-label="Footer" className="flex gap-6">
            <Link href="/" className="transition-colors duration-200 hover:text-white">
              Home
            </Link>
            <Link href="/about" className="transition-colors duration-200 hover:text-white">
              About
            </Link>
            <Link href="/about#contact" className="transition-colors duration-200 hover:text-white">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
