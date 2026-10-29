import Link from "next/link";
import { services } from "@/data/services";

export type ServicesProps = Record<string, never>;

export default function Services() {
  return (
    <section className="mt-24 sm:mt-32">
      <h2 className="font-serif text-3xl italic sm:text-4xl">lo que hacemos</h2>

      <ul className="mt-10 border-b border-black">
        {services.map((service, i) => (
          <li
            key={service.id}
            className="grid gap-6 border-t border-black py-10 md:grid-cols-[4rem_1fr_1fr] md:gap-10 md:py-14"
          >
            <span className="text-sm text-black/40 tabular-nums">0{i + 1}</span>

            <div>
              <h3 className="text-3xl font-medium tracking-tight sm:text-5xl">{service.title}</h3>
              <p className="mt-2 font-serif text-xl text-black/50 italic sm:text-2xl">
                {service.subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-lg leading-relaxed text-black/80">{service.description}</p>
              <ul className="flex flex-wrap gap-1">
                {service.includes.map((item) => (
                  <li key={item} className="rounded-full bg-black/5 px-4 py-2 text-sm font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-16 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-2xl tracking-tight sm:text-3xl">
          ¿tienes un proyecto en mente?
        </p>
        <Link
          href="/contact"
          className="rounded-full bg-black px-10 py-4 text-lg font-medium tracking-tight text-white transition-colors duration-200 hover:bg-[#FFE600] hover:text-black"
        >
          cuéntanos
        </Link>
      </div>
    </section>
  );
}
