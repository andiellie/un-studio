"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "home", href: "/" },
  { label: "about", href: "/about" },
];

export const contactItem: NavItem = { label: "contact", href: "/about#contact" };

export type HeaderProps = Record<string, never>;

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

type NavLinkProps = {
  item: NavItem;
  className: (active: boolean) => string;
  onClick?: () => void;
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// Reads the pathname, so it must sit inside <Suspense> (dynamic routes like
// /projects/[slug] don't know their pathname while prerendering).
function ActiveNavLink({ item, className, onClick }: NavLinkProps) {
  const active = isActive(usePathname(), item.href);
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={className(active)}
    >
      {item.label}
    </Link>
  );
}

function NavLink(props: NavLinkProps) {
  const { item, className, onClick } = props;
  return (
    <Suspense
      fallback={
        <Link href={item.href} onClick={onClick} className={className(false)}>
          {item.label}
        </Link>
      }
    >
      <ActiveNavLink {...props} />
    </Suspense>
  );
}

const desktopPillClass = (active: boolean) =>
  `block rounded-full px-5 py-2.5 text-lg font-medium tracking-tight capitalize transition-colors duration-200 ${
    active ? "bg-white text-black" : "bg-white/10 hover:bg-white hover:text-black"
  }`;

const mobilePillClass = () =>
  "block rounded-full bg-white/10 px-5 py-3 text-lg font-medium tracking-tight capitalize";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between gap-6 px-4 sm:px-8">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label="unstudio, inicio"
          className="shrink-0"
        >
          <Image
            src="/logos/unstudio.png"
            alt="unstudio"
            width={2415}
            height={936}
            priority
            className="h-10 w-auto invert"
          />
        </Link>

        <div className="flex items-center gap-8">
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} className={desktopPillClass} />
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href={contactItem.href}
            onClick={() => setOpen(false)}
            className="group hidden items-center sm:flex"
          >
            <span className="rounded-full border-2 border-white px-5 py-2 text-lg font-medium tracking-tight capitalize transition-colors duration-200 group-hover:bg-white group-hover:text-black">
              {contactItem.label}
            </span>
            <span className="-ml-0.5 grid size-12 place-items-center rounded-full border-2 border-white transition-colors duration-200 group-hover:bg-white group-hover:text-black">
              <ArrowIcon className="size-5 transition-transform duration-200 group-hover:rotate-45" />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="grid size-12 place-items-center rounded-full border-2 border-white md:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-0.5 w-full bg-current transition-transform duration-200 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-full bg-current transition-transform duration-200 ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Principal" className="px-4 pb-6 md:hidden">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink item={item} className={mobilePillClass} onClick={() => setOpen(false)} />
              </li>
            ))}
            <li>
              <Link
                href={contactItem.href}
                onClick={() => setOpen(false)}
                className={mobilePillClass()}
              >
                {contactItem.label}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
