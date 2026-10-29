export type QuestionType = "single" | "multi" | "text";

export type ServiceQuestion = {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
};

export type Service = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  includes: string[];
  questions: ServiceQuestion[];
};

export const services: Service[] = [
  {
    id: "mobiliario",
    title: "Mobiliario",
    subtitle: "Signature Furniture",
    description:
      "Piezas hechas a la medida del espacio y de quien lo habita. Diseñamos, prototipamos y producimos con talleres locales, cuidando cada unión y cada acabado.",
    includes: ["piezas únicas", "series cortas", "proyectos de espacio completo", "prototipado"],
    questions: [
      {
        id: "piezas",
        label: "¿qué pieza tienes en mente?",
        type: "multi",
        options: ["mesa", "silla", "sillón", "librero", "iluminación", "otra"],
        required: true,
      },
      {
        id: "espacio",
        label: "¿para qué espacio es?",
        type: "single",
        options: ["casa", "oficina", "local comercial", "hotel / restaurante"],
        required: true,
      },
      {
        id: "escala",
        label: "¿de qué tamaño es el proyecto?",
        type: "single",
        options: ["una pieza única", "algunas piezas", "un espacio completo"],
        required: true,
      },
      {
        id: "medidas",
        label: "¿alguna medida o material que ya tengas en mente?",
        type: "text",
        placeholder: "ej. mesa de 2 m en madera maciza",
      },
      {
        id: "plazo",
        label: "¿para cuándo lo necesitas?",
        type: "single",
        options: ["sin prisa", "en 1 a 3 meses", "lo antes posible"],
        required: true,
      },
    ],
  },
  {
    id: "identidad-de-marca",
    title: "Identidad de marca",
    subtitle: "Brand Experience",
    description:
      "Marcas que se sienten igual en una taza, en una fachada y en una pantalla. Construimos el sistema completo para que tu negocio se vea como piensa.",
    includes: ["estrategia de marca", "logo y sistema visual", "packaging", "papelería y señalética"],
    questions: [
      {
        id: "etapa",
        label: "¿en qué punto está tu marca?",
        type: "single",
        options: ["es nueva", "quiero rediseñarla", "necesito ajustes puntuales"],
        required: true,
      },
      {
        id: "rubro",
        label: "¿a qué se dedica?",
        type: "text",
        placeholder: "ej. cafetería de especialidad en la Roma",
        required: true,
      },
      {
        id: "entregables",
        label: "¿qué necesitas?",
        type: "multi",
        options: ["logo", "paleta y tipografías", "manual de marca", "packaging", "papelería", "señalética"],
        required: true,
      },
      {
        id: "referencias",
        label: "¿alguna marca que te inspire?",
        type: "text",
        placeholder: "nombres o links",
      },
    ],
  },
  {
    id: "redes-y-contenido",
    title: "Redes y contenido",
    subtitle: "Digital Presence",
    description:
      "Contenido con intención, no por llenar el feed. Definimos la voz, diseñamos las piezas y acompañamos mes a mes para que tu marca crezca con coherencia.",
    includes: ["estrategia de contenido", "dirección de arte", "fotografía y video", "gestión mensual"],
    questions: [
      {
        id: "redes",
        label: "¿en qué redes quieres estar?",
        type: "multi",
        options: ["instagram", "tiktok", "pinterest", "linkedin"],
        required: true,
      },
      {
        id: "alcance",
        label: "¿qué buscas?",
        type: "multi",
        options: ["estrategia", "diseño de piezas", "fotografía", "video / reels", "gestión mensual"],
        required: true,
      },
      {
        id: "modalidad",
        label: "¿es algo puntual o continuo?",
        type: "single",
        options: ["un lanzamiento puntual", "acompañamiento mensual"],
        required: true,
      },
      {
        id: "cuenta",
        label: "si ya tienes cuenta, ¿cuál es?",
        type: "text",
        placeholder: "@tumarca",
      },
    ],
  },
];
