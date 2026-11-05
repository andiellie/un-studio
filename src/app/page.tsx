import Hero from "@/components/home/Hero";
import Timeline from "@/components/home/Timeline";
import ServiceRows from "@/components/home/ServiceRows";
import Collabs from "@/components/home/Collabs";

export default function HomePage() {
  return (
    <section>
      <Hero />
      <Timeline />
      <ServiceRows />
      <Collabs />
    </section>
  );
}
