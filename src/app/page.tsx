import { LenisProvider } from "@/components/LenisProvider";
import { IntroOverlay } from "@/components/IntroOverlay";
import { Hero } from "@/components/Hero";
import { RevealSequence } from "@/components/RevealSequence";
import { Manifesto } from "@/components/Manifesto";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { CircleGallery } from "@/components/CircleGallery";
import { Skills } from "@/components/Skills";
import { Metrics } from "@/components/Metrics";
import { Awards } from "@/components/Awards";
import { Contact } from "@/components/Contact";
import { FooterSection } from "@/components/FooterSection";
import { ScrollChrome } from "@/components/ScrollChrome";

/**
 * Assembly per docs/research/PAGE_TOPOLOGY.md:
 * intro layers → 400vh scroll-wrap (sticky hero) → fixed reveal sequence →
 * section-after (manifesto + about + projects) → 600vh circle gallery → skills
 * → metrics → press marquee → contact (blob/pin) → footer transition + fixed
 * footer, with fixed scroll chrome.
 */
export default function Home() {
  return (
    <LenisProvider>
      <IntroOverlay />
      <Hero />
      <RevealSequence />
      <section className="section-after" id="section-after">
        <Manifesto />
        <About />
        <Projects />
      </section>
      <CircleGallery />
      <Skills />
      <Metrics />
      <Awards />
      <Contact />
      <FooterSection />
      <ScrollChrome />
    </LenisProvider>
  );
}
