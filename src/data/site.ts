export type SocialLink = {
  label: string;
  href: string;
};

export type SiteInfo = {
  name: string;
  tagline: [string, string];
  email: string;
  bookingHref: string;
  socials: SocialLink[];
};

// TODO: completar con los datos reales de unstudio
export const site: SiteInfo = {
  name: "unstudio",
  tagline: ["Let’s start", "something new"],
  email: "",
  bookingHref: "/about#contact",
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Behance", href: "#" },
  ],
};
