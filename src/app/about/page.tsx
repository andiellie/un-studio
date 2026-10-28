import AboutIntro from "@/components/about/AboutIntro";
import Services from "@/components/about/Services";
import ContactForm from "@/components/about/ContactForm";

export default function AboutPage() {
  return (
    <>
      <section id="about" className="scroll-mt-24">
        <AboutIntro />
        <Services />
      </section>
      <section id="contact" className="scroll-mt-24">
        <ContactForm />
      </section>
    </>
  );
}
