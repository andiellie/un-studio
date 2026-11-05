export type SocialLink = {
  label: string;
  href: string;
};

export type SiteInfo = {
  name: string;
  tagline: [string, string];
  email: string;
  bookingHref: string;
  whatsappHref: string;
  socials: SocialLink[];
};

const WHATSAPP_HREF =
  "https://wa.me/5218711865253?text=%C2%A1Hola!+Me+interesa+obtener+m%C3%A1s+informaci%C3%B3n+sobre+los+servicios+de+unstudio.+%C2%A1Muchas+gracias!";

// TODO: completar con los datos reales de unstudio
export const site: SiteInfo = {
  name: "unstudio",
  tagline: ["Trabajemos", "junt@s"],
  email: "",
  // "#proyecto" opens the contact form directly (see components/contact/ContactIntro).
  bookingHref: "/contact#proyecto",
  whatsappHref: WHATSAPP_HREF,
  socials: [
    { label: "Instagram", href: "#" },
    { label: "WhatsApp", href: WHATSAPP_HREF },
    { label: "TikTok", href: "#" },
  ],
};
