import type { Metadata } from "next";
import { lastUpdated, legalDocuments } from "@/data/legal";

export const metadata: Metadata = {
  title: "Legal — unstudio",
  description: "Términos y condiciones y aviso de privacidad de unstudio.",
};

export default function LegalPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm text-black/50">actualizado el {lastUpdated}</p>
      <h1 className="mt-6 text-4xl leading-[1.05] font-medium tracking-tight sm:text-6xl">
        Legal
      </h1>

      <nav aria-label="Documentos legales" className="mt-10 flex flex-wrap gap-1">
        {legalDocuments.map((doc) => (
          <a
            key={doc.id}
            href={`#${doc.id}`}
            className="rounded-full bg-black/5 px-5 py-2.5 text-lg font-medium tracking-tight transition-colors duration-200 hover:bg-black hover:text-white"
          >
            {doc.title}
          </a>
        ))}
      </nav>

      {legalDocuments.map((doc) => (
        <section key={doc.id} id={doc.id} className="mt-24 scroll-mt-28 border-t border-black pt-10">
          <h2 className="font-serif text-3xl italic sm:text-4xl">{doc.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-black/80">{doc.intro}</p>

          <ol className="mt-12 flex flex-col gap-10">
            {doc.sections.map((section, i) => (
              <li key={section.title} className="grid gap-3 sm:grid-cols-[3rem_1fr]">
                <span className="text-sm text-black/40 tabular-nums sm:pt-1.5">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{section.title}</h3>
                  {section.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)} className="mt-3 text-base leading-relaxed text-black/75 sm:text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </article>
  );
}
