import Hero from "@/components/sections/hero";
import Work from "@/components/sections/work";
import About from "@/components/sections/about";
import Skills from "@/components/sections/skills";
import Writing from "@/components/sections/writing";
import Contact from "@/components/sections/contact";
import Footer from "@/components/layout/footer";
import SectionSeparator from "@/components/ui/section-separator";

export default function Home() {
  return (
    <main className="page">
      <Hero />
      <SectionSeparator />
      <Work />
      <SectionSeparator />
      <About />
      <SectionSeparator />
      <Skills />
      <SectionSeparator />
      <Writing />
      <SectionSeparator />
      <Contact />
      <SectionSeparator />
      <Footer />
    </main>
  );
}
