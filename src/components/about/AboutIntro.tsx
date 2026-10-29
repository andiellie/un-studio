import { about } from "@/data/about";

export type AboutIntroProps = Record<string, never>;

export default function AboutIntro() {
  const [before, accent, after] = about.headline;

  return (
    <section className="flex flex-col gap-24 sm:gap-32">
      <div>
        <p className="text-sm text-black/50">{about.eyebrow}</p>
        <h1 className="mt-6 max-w-5xl text-4xl leading-[1.05] font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl">
          {before}
          <span className="font-serif font-normal italic">{accent}</span>
          {after}
        </h1>
      </div>

      <div className="grid gap-8 text-lg leading-relaxed text-black/80 md:grid-cols-2 md:gap-16 lg:text-xl">
        {about.story.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>

      <dl className="grid gap-10 border-t border-black pt-10 sm:grid-cols-3">
        {about.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2">
            <dt className="order-2 text-base text-black/60">{stat.label}</dt>
            <dd className="order-1 font-serif text-6xl italic sm:text-7xl">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div>
        <h2 className="font-serif text-3xl italic sm:text-4xl">del boceto a la entrega</h2>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          {about.process.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-4 bg-white p-6 sm:p-8">
              <span className="text-sm text-black/40 tabular-nums">0{i + 1}</span>
              <h3 className="text-2xl font-medium tracking-tight">{step.title}</h3>
              <p className="text-base leading-relaxed text-black/70">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
