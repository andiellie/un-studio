"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "home", href: "/" },
  { label: "projects", href: "/projects" },
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

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md">
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
            className="h-10 w-auto dark:invert"
          />
        </Link>

        <div className="flex items-center gap-8">
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-full px-5 py-2.5 text-lg font-medium tracking-tight capitalize transition-colors duration-200 ${
                        active
                          ? "bg-foreground text-background"
                          : "bg-pill hover:bg-foreground hover:text-background"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href={contactItem.href}
            onClick={() => setOpen(false)}
            className="group hidden items-center sm:flex"
          >
            <span className="rounded-full border-2 border-foreground px-5 py-2 text-lg font-medium tracking-tight capitalize transition-colors duration-200 group-hover:bg-foreground group-hover:text-background">
              {contactItem.label}
            </span>
            <span className="-ml-0.5 grid size-12 place-items-center rounded-full border-2 border-foreground transition-colors duration-200 group-hover:bg-foreground group-hover:text-background">
              <ArrowIcon className="size-5 transition-transform duration-200 group-hover:rotate-45" />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="grid size-12 place-items-center rounded-full border-2 border-foreground md:hidden"
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
            {[...navItems, contactItem].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) && item !== contactItem ? "page" : undefined}
                  className="block rounded-full bg-pill px-5 py-3 text-lg font-medium tracking-tight capitalize"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
