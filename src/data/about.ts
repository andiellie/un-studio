export type AboutStat = {
  value: string;
  label: string;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type AboutContent = {
  eyebrow: string;
  // The middle part is set in Instrument Serif italic.
  headline: [string, string, string];
  story: string[];
  stats: AboutStat[];
  process: ProcessStep[];
};

// TODO: texto inventado de ejemplo, reemplazar con la información real de unstudio
export const about: AboutContent = {
  eyebrow: "sobre nosotros",
  headline: ["Somos un estudio pequeño con ", "obsesión", " por los detalles."],
  story: [
    "unstudio nació en 2021 en Ciudad de México, entre un taller de carpintería y una mesa llena de bocetos. Lo que empezó como un par de muebles para amigos se volvió una forma de trabajar: entender a fondo a quien tenemos enfrente y diseñar todo lo que toca a su marca.",
    "Hoy diseñamos mobiliario, identidades y presencia digital para negocios que quieren verse como piensan. Trabajamos con pocos clientes a la vez para estar en cada decisión, desde el grosor de una madera hasta el tono de un post.",
  ],
  stats: [
    { value: "+60", label: "proyectos entregados" },
    { value: "3", label: "disciplinas bajo un mismo criterio" },
    { value: "12", label: "talleres locales con los que producimos" },
  ],
  process: [
    {
      title: "Escuchamos",
      description: "Una primera sesión para entender tu negocio, tu espacio y lo que quieres provocar.",
    },
    {
      title: "Bocetamos",
      description: "Exploramos caminos, materiales y referencias. Te mostramos pocas opciones, bien pensadas.",
    },
    {
      title: "Construimos",
      description: "Producimos con talleres y equipos que conocemos, y revisamos cada detalle antes de entregar.",
    },
    {
      title: "Acompañamos",
      description: "Seguimos cerca después de la entrega para que todo funcione y crezca con coherencia.",
    },
  ],
};
