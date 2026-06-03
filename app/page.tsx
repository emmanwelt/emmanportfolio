import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";
import SpiderCanvas from "./components/SpiderCanvas";

export default function Home() {
  return (
    <>
      {/* Spider roams behind everything */}
      <SpiderCanvas />

      {/* All page content sits above the canvas */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar />
        <main>
          <Hero />
          <Skills />
          <Projects />
          <Education />
        </main>
        <Contact />
      </div>
    </>
  );
}
