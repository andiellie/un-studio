export type HeroCard = {
  id: string;
  title: string;
  // Path inside /public, e.g. "/hero/helado.jpg". Without it the card shows `tint`.
  src?: string;
  alt: string;
  tint: string;
};

// TODO: agregar las imágenes reales en public/hero/ y completar `src`
export const heroCards: HeroCard[] = [
  { id: "helado", title: "branding.png", alt: "Branding de heladería", tint: "#f2f2f3" },
  { id: "botella", title: "packaging.png", alt: "Packaging de botella", tint: "#f2f2f3" },
  { id: "flores", title: "campaña.png", alt: "Campaña de flores", tint: "#f2f2f3" },
  { id: "sillon", title: "muebles.png", alt: "Sillón tapizado", tint: "#f2f2f3" },
  { id: "catalogo", title: "editorial.png", alt: "Catálogo impreso", tint: "#f2f2f3" },
  { id: "redes", title: "redes.png", alt: "Contenido para redes", tint: "#f2f2f3" },
  { id: "papeleria", title: "papelería.png", alt: "Papelería con hot stamping", tint: "#f2f2f3" },
  { id: "interiores", title: "interiores.png", alt: "Proyecto de interiores", tint: "#f2f2f3" },
];
