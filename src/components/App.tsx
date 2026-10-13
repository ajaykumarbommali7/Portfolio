import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";
import RevealObserver from "./ui/RevealObserver";
import { SmoothScroll } from "@/lib/scroll";
import { ACHIEVEMENTS, CERTIFICATIONS } from "@/lib/data";

/**
 * Section order: Hero → About → Skills → Work → Certifications → Experience →
 * Achievements → Contact. Sections with no résumé data are skipped, and the
 * numbered tags follow whatever is actually rendered.
 */
export default function App() {
  const order = [
    "about",
    "skills",
    "work",
    ...(CERTIFICATIONS.length ? ["certifications"] : []),
    "experience",
    ...(ACHIEVEMENTS.length ? ["achievements"] : []),
    "contact",
  ];
  const n = (id: string) => String(order.indexOf(id) + 1).padStart(2, "0");

  return (
    <SmoothScroll>
      <a href="#main" className="sr-only-focusable btn btn-primary fixed left-4 top-4 z-[100]">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <Hero />
        <About index={n("about")} />
        <Skills index={n("skills")} />
        <Work index={n("work")} />
        {CERTIFICATIONS.length > 0 && <Certifications index={n("certifications")} />}
        <Experience index={n("experience")} />
        {ACHIEVEMENTS.length > 0 && <Achievements index={n("achievements")} />}
        <Contact index={n("contact")} />
      </main>
      <RevealObserver />
    </SmoothScroll>
  );
}
