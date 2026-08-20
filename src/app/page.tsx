import { LenisProvider } from "@/components/LenisProvider";
import { IntroOverlay } from "@/components/IntroOverlay";
import { Hero } from "@/components/Hero";
import { BrandMark } from "@/components/BrandMark";
import { SiteHeader } from "@/components/SiteHeader";
import { RevealSequence } from "@/components/RevealSequence";
import { Manifesto } from "@/components/Manifesto";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { CircleGallery } from "@/components/CircleGallery";
import { Skills } from "@/components/Skills";
import { Metrics } from "@/components/Metrics";
import { ConsultationBand, ClientsBand } from "@/components/HomeSections";
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
      <SiteHeader variant="home" />
      <BrandMark />
      <Hero />
      <RevealSequence />
      {/* Section order follows the Website Copy Master exactly.
          S5 reuses the orbit gallery and S8 reuses the editorial list rather
          than adding new sections. */}
      <section className="section-after" id="section-after">
        <Manifesto />
        <Skills />
        <About />
      </section>
      <CircleGallery />
      <Metrics />
      <ClientsBand />
      <Projects />
      <ConsultationBand />
      <Awards />
      <Contact />
      <FooterSection />
      <ScrollChrome />
    </LenisProvider>
  );
}
