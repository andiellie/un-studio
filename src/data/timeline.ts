export type TimelineImage = {
  // Path inside /public.
  src: string;
  alt: string;
  caption: string;
  // CSS aspect-ratio, e.g. "4/3".
  ratio: string;
};

export type TimelineRow = {
  // Narrow column: optional small image, caption and paragraph.
  small?: TimelineImage;
  text: string;
  // Wide column, offset lower so the two columns read staggered.
  large: TimelineImage;
  // Puts the text column on the right.
  flip?: boolean;
};

export type TimelineChapter = {
  id: string;
  // Rolled out cell by cell in the band, e.g. "01".
  number: string;
  label: string;
  // Band and strip background.
  cover: { src: string; alt: string };
  statement: string;
  rows: TimelineRow[];
};

// Home scroll section under the hero (components/home/Timeline.tsx).
// Images come from public/Branding-Packaging, public/Signature Furniture and
// public/Social Presence, exported to public/timeline.
export const timeline: TimelineChapter[] = [
  {
    id: "branding",
    number: "01",
    label: "branding y packaging",
    cover: { src: "/timeline/noa-agave.jpg", alt: "Logotipo de NOA sobre una planta de agave" },
    statement: "Marcas que se reconocen antes de leerse.",
    rows: [
      {
        small: {
          src: "/timeline/noa-paleta.jpg",
          alt: "Paleta de color y aplicaciones del logotipo NOA",
          caption: "NOA, sistema de identidad",
          ratio: "16/9",
        },
        text: "Empezamos por entender qué tiene que sentir la gente al ver tu marca. De ahí salen el nombre, el símbolo, la paleta y las reglas que la mantienen igual en cada lugar donde aparece.",
        large: {
          src: "/timeline/cardenche-cactus.jpg",
          alt: "Empaque Cardenche entre nopales en el desierto",
          caption: "Cardenche, empaque",
          ratio: "4/5",
        },
      },
      {
        flip: true,
        text: "El empaque es la primera vez que alguien toca tu marca. Lo diseñamos para que se vea bien en el anaquel, en la mano y en la foto que alguien sube después.",
        large: {
          src: "/timeline/enyog-tienda.jpg",
          alt: "Vaso de yogurt helado Enyog servido en tienda",
          caption: "Enyog, punto de venta",
          ratio: "3/4",
        },
      },
    ],
  },
  {
    id: "mobiliario",
    number: "02",
    label: "mobiliario de autor",
    cover: { src: "/timeline/olive-librero.jpg", alt: "Render del librero Olive con arcos y sillón" },
    statement: "Piezas pensadas a mano, hechas para quedarse.",
    rows: [
      {
        small: {
          src: "/timeline/olive-boceto.jpg",
          alt: "Boceto a color del librero Olive",
          caption: "Olive bookshelf, boceto",
          ratio: "3/2",
        },
        text: "Cada mueble empieza en papel. Probamos proporciones, arcos y uniones a mano antes de pasar a modelo y a taller.",
        large: {
          src: "/timeline/olive-proceso.jpg",
          alt: "Bocetos del librero Olive extendidos sobre una mesa",
          caption: "Olive bookshelf, proceso",
          ratio: "3/4",
        },
      },
      {
        flip: true,
        text: "Verde olivo, mármol y latón. Elegimos materiales que envejecen bien y detalles que se notan de cerca.",
        large: {
          src: "/timeline/side-table-detalle.jpg",
          alt: "Detalle de la mesa auxiliar Olive en verde olivo con cubierta de mármol",
          caption: "Olive side table, detalle",
          ratio: "3/2",
        },
      },
    ],
  },
  {
    id: "presencia",
    number: "03",
    label: "presencia digital",
    cover: { src: "/timeline/epio-tienda.jpg", alt: "Fachada de la tienda Epio de noche" },
    statement: "La misma marca en la calle, en la pantalla y en tu feed.",
    rows: [
      {
        small: {
          src: "/timeline/epio-redes.jpg",
          alt: "Tienda en línea y redes sociales de Epio",
          caption: "Epio, tienda en línea",
          ratio: "16/9",
        },
        text: "Llevamos la identidad a redes, tienda en línea y campañas, con un sistema de plantillas que tu equipo puede seguir usando.",
        large: {
          src: "/timeline/enva-redes.jpg",
          alt: "Publicaciones de redes sociales para ENVA",
          caption: "ENVA, redes sociales",
          ratio: "16/9",
        },
      },
      {
        flip: true,
        text: "Contenido que se reconoce sin ver el logo: mismo tono, misma retícula, mismos colores en cada publicación.",
        large: {
          src: "/timeline/maizito-etiquetas.jpg",
          alt: "Comparativa de etiquetas de salsas El Maizito",
          caption: "El Maizito, etiquetas",
          ratio: "16/9",
        },
      },
    ],
  },
];
