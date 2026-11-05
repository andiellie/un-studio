export type HeroCard = {
  id: string;
  title: string;
  // Path inside /public, e.g. "/hero/helado.jpg". Without it the card shows `tint`.
  src?: string;
  alt: string;
  tint: string;
};

// Order matters: index i uses layout[i] in components/home/Hero.tsx.
// On phone/tablet only cards 0, 2, 4 and 7 are visible.
export const heroCards: HeroCard[] = [
  { id: "enyog", title: "branding.png", src: "/hero/enyog-cono.jpg", alt: "Cono de helado de yogurt Enyog sobre fondo amarillo", tint: "#f5d90a" },
  { id: "cardenche", title: "empaque.png", src: "/hero/cardenche.jpg", alt: "Empaque Cardenche entre cactus", tint: "#c9a77a" },
  { id: "olive-side-table", title: "muebles.png", src: "/hero/olive-side-table.jpg", alt: "Mesa auxiliar Olive en verde olivo y mármol", tint: "#e8e2d6" },
  { id: "perfume", title: "packaging.png", src: "/hero/perfume.jpg", alt: "Packaging cilíndrico de perfume en tonos terracota", tint: "#c86f45" },
  { id: "octubre-rosa", title: "redes.png", src: "/hero/octubre-rosa.jpg", alt: "Pieza para redes de Octubre Rosa", tint: "#f4c27a" },
  { id: "gaga-mirror", title: "interiores.png", src: "/hero/gaga-mirror.jpg", alt: "Espejo GaGa en un baño", tint: "#d9d6d2" },
  { id: "maizito-salsa", title: "producto.png", src: "/hero/maizito-salsa-verde.jpg", alt: "Salsa verde El Maizito con chiles", tint: "#c7c94a" },
  { id: "maizito-bolsa", title: "identidad.png", src: "/hero/maizito-bolsa.jpg", alt: "Salsas El Maizito en bolsa de red roja", tint: "#f3c9c4" },
];
