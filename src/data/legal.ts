export type LegalSection = {
  title: string;
  body: string[];
};

export type LegalDocument = {
  id: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

// TODO: completar con los datos reales y pedir a un abogado que revise ambos textos.
export const company = {
  legalName: "[RAZÓN SOCIAL]",
  address: "[DOMICILIO COMPLETO]",
  city: "[CIUDAD]",
  email: "[CORREO DE CONTACTO]",
};

export const lastUpdated = "28 de octubre de 2026";

export const legalDocuments: LegalDocument[] = [
  {
    id: "terminos",
    title: "Términos y condiciones",
    intro: `Estos términos regulan el uso del sitio web de unstudio, operado por ${company.legalName}. Al navegar en el sitio aceptas lo que se describe aquí.`,
    sections: [
      {
        title: "Uso del sitio",
        body: [
          "El sitio tiene fines informativos: presenta nuestro trabajo, nuestros servicios y una forma de contactarnos.",
          "Te pedimos usarlo de buena fe, sin intentar dañarlo, alterar su funcionamiento ni enviar información falsa o de terceros sin su permiso.",
        ],
      },
      {
        title: "Servicios y cotizaciones",
        body: [
          "La información sobre servicios es orientativa. Cualquier proyecto se define en una propuesta o contrato por escrito, con alcance, tiempos y costos específicos.",
          "Enviar el formulario de contacto no genera ninguna obligación de contratación para ninguna de las partes.",
        ],
      },
      {
        title: "Propiedad intelectual",
        body: [
          "Los textos, el diseño del sitio, el logotipo y demás elementos de la marca unstudio son propiedad de unstudio y no pueden usarse sin autorización.",
          "Los proyectos mostrados pertenecen a sus respectivos clientes y se publican con fines de portafolio.",
        ],
      },
      {
        title: "Responsabilidad",
        body: [
          "Procuramos que la información del sitio sea correcta y esté actualizada, pero no garantizamos que esté libre de errores ni que el sitio esté disponible en todo momento.",
          "Los enlaces a sitios de terceros, como redes sociales, se rigen por sus propias condiciones.",
        ],
      },
      {
        title: "Cambios y legislación aplicable",
        body: [
          "Podemos actualizar estos términos en cualquier momento; la versión vigente siempre estará publicada en esta página.",
          `Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia se resolverá ante los tribunales competentes de ${company.city}.`,
        ],
      },
    ],
  },
  {
    id: "privacidad",
    title: "Aviso de privacidad",
    intro: `${company.legalName} ("unstudio"), con domicilio en ${company.address}, es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.`,
    sections: [
      {
        title: "Datos que recabamos",
        body: [
          "A través del formulario de contacto recabamos: nombre, correo electrónico, los servicios que te interesan, tus respuestas sobre el proyecto y el mensaje que nos escribas.",
          "No solicitamos datos personales sensibles ni datos financieros.",
        ],
      },
      {
        title: "Para qué usamos tus datos",
        body: [
          "Finalidades principales: responder tu mensaje, entender tu proyecto, enviarte una propuesta o cotización y dar seguimiento a la conversación.",
          `Finalidad secundaria: enviarte ocasionalmente novedades del estudio. Si no quieres recibirlas, escríbenos a ${company.email} y dejaremos de hacerlo.`,
        ],
      },
      {
        title: "Con quién los compartimos",
        body: [
          "No vendemos ni rentamos tus datos. Solo los comparten con nosotros los proveedores que nos ayudan a operar el sitio y el correo (por ejemplo, alojamiento web y envío de correos), quienes los tratan únicamente bajo nuestras instrucciones.",
          "Podremos compartirlos con autoridades cuando una ley u orden judicial lo exija.",
        ],
      },
      {
        title: "Tus derechos (ARCO)",
        body: [
          "Puedes acceder a tus datos, rectificarlos, cancelarlos u oponerte a su uso, así como revocar tu consentimiento.",
          `Para hacerlo, envía un correo a ${company.email} con tu nombre, el derecho que quieres ejercer y una forma de verificar tu identidad. Te responderemos en un plazo máximo de 20 días hábiles.`,
        ],
      },
      {
        title: "Conservación y seguridad",
        body: [
          "Conservamos tus datos solo el tiempo necesario para las finalidades descritas y aplicamos medidas razonables para protegerlos contra pérdida o acceso no autorizado.",
        ],
      },
      {
        title: "Cookies",
        body: [
          "El sitio no utiliza cookies de publicidad ni de seguimiento. Si en el futuro las incorporamos, lo indicaremos en este aviso.",
        ],
      },
      {
        title: "Cambios a este aviso",
        body: [
          "Cualquier cambio a este aviso de privacidad se publicará en esta misma página, indicando la fecha de la última actualización.",
        ],
      },
    ],
  },
];
