"use client";

import { useState, useEffect, useRef } from "react";

type Project = {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  emoji: string;
  image?: string | null;
  jumpscare?: boolean;
  githubUrl: string;
  liveUrl: string;
};

const projects: Project[] = [
  {
    title: "Pugon Wallet",
    description:
      "I recently developed a digital wallet application called Pugon Wallet for a class project. Inspired by platforms like GCash, it allows users to securely deposit, store, and manage their cash electronically.",
    tags: ["Java", "Python", "C#"],
    gradient: "from-purple-500/20 to-violet-500/20",
    emoji: "🚀",
    image: "/pugonwallet.png",
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    title: "The Last Line",
    description:
      "For our ongoing BSIT Capstone project, my team and I are developing an immersive horror game inside Roblox. The gameplay revolves around psychological tension and critical thinking, forcing players to solve complex puzzles and decode cryptic systems to progress and survive the game. I am currently handling the logic, scripting, and layout mechanics to ensure a smooth and terrifying user experience.",
    tags: ["Python", "Graphics Design", "Social Media"],
    gradient: "from-cyan-500/20 to-blue-500/20",
    emoji: "⚡",
    image: "/capstone.png",
    jumpscare: true,
    githubUrl: "#",
    liveUrl: "#",
  },
];

// ── Bat component ─────────────────────────────────────────────────────────────
// Uses inline keyframes via Web Animations API for true curved erratic paths
function Bat({ id }: { id: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Random start anywhere on screen
    const sx = Math.random() * vw;
    const sy = Math.random() * vh;

    // Generate 4-6 random waypoints so the bat zig-zags around
    const steps = 4 + Math.floor(Math.random() * 3);
    const keyframes: Keyframe[] = [{ transform: `translate(${sx}px, ${sy}px) scaleX(1)`, opacity: "0" }];

    let prevX = sx;
    for (let i = 0; i < steps; i++) {
      const tx = Math.random() * vw;
      const ty = Math.random() * vh;
      const flip = tx < prevX ? -1 : 1;
      keyframes.push({
        transform: `translate(${tx}px, ${ty}px) scaleX(${flip})`,
        opacity: i === 0 ? "1" : i === steps - 1 ? "0" : "1",
      });
      prevX = tx;
    }

    const duration = 800 + Math.random() * 1000;
    const delay = Math.random() * 900;

    el.animate(keyframes, {
      duration,
      delay,
      easing: "ease-in-out",
      fill: "forwards",
    });
  }, []);

  const size = 18 + Math.floor(Math.random() * 40);

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none select-none"
      style={{ fontSize: `${size}px`, top: 0, left: 0, opacity: 0 }}
    >
      🦇
    </div>
  );
}

// ── Jumpscare overlay ─────────────────────────────────────────────────────────
function JumpscareOverlay({ onDone }: { onDone: () => void }) {
  const bats = Array.from({ length: 40 }, (_, i) => i);
  const [flash, setFlash] = useState(true);

  useEffect(() => {
    // Flash red a few times
    let count = 0;
    const iv = setInterval(() => {
      setFlash((f) => !f);
      count++;
      if (count > 6) clearInterval(iv);
    }, 120);

    const timer = setTimeout(onDone, 2000);
    return () => {
      clearTimeout(timer);
      clearInterval(iv);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[60] overflow-hidden transition-colors duration-100"
      style={{ backgroundColor: flash ? "#0a0000" : "#1f0000" }}
    >
      {/* Big center bat pulsing */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <span
          className="text-8xl md:text-[10rem] animate-[screamPulse_0.25s_ease_infinite]"
          style={{ filter: "drop-shadow(0 0 30px rgba(255,0,0,0.8))" }}
        >
          🦇
        </span>
      </div>
      {/* Flying bats */}
      {bats.map((id) => (
        <Bat key={id} id={id} />
      ))}
    </div>
  );
}

// ── Image modal ───────────────────────────────────────────────────────────────
function ImageModal({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 ${closing ? "animate-[fadeOut_0.28s_ease_forwards]" : "animate-[fadeIn_0.3s_ease]"}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} preview`}
    >
      <div
        className={`relative max-w-4xl w-full ${closing ? "animate-[popOut_0.28s_ease_forwards]" : "animate-[popIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors duration-200 text-sm flex items-center gap-1"
          aria-label="Close preview"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Close
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={title}
          className="max-h-[80vh] w-auto mx-auto rounded-xl shadow-2xl border border-white/10 object-contain"
        />
        <p className="text-center text-white/50 text-sm mt-3">{title}</p>
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function GithubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Projects() {
  const [modalImage, setModalImage] = useState<{ src: string; title: string } | null>(null);
  const [showJumpscare, setShowJumpscare] = useState(false);
  const pendingModal = useRef<{ src: string; title: string } | null>(null);

  const handleImageClick = (project: Project) => {
    if (!project.image) return;
    if (project.jumpscare) {
      pendingModal.current = { src: project.image, title: project.title };
      setShowJumpscare(true);
    } else {
      setModalImage({ src: project.image, title: project.title });
    }
  };

  const handleJumpscareDone = () => {
    setShowJumpscare(false);
    if (pendingModal.current) {
      setModalImage(pendingModal.current);
      pendingModal.current = null;
    }
  };

  return (
    <section id="projects" className="py-24 px-6 relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-4">
            My Work
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-blue-500 to-yellow-400 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base">
            A selection of projects I&apos;ve built — each one a new problem to solve and a new skill to sharpen.
          </p>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {projects.map((project) => (
            <article
              key={project.title}
              className={`gradient-border flex flex-col overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${
                project.title === "The Last Line"
                  ? "shadow-[0_0_60px_12px_rgba(255,255,255,0.18)] hover:shadow-[0_0_80px_24px_rgba(220,38,38,0.6)]"
                  : "shadow-[0_0_60px_12px_rgba(255,255,255,0.18)] hover:shadow-[0_0_80px_20px_rgba(255,255,255,0.30)]"
              }`}
            >
              {/* Card top image */}
              <div
                className={`h-32 bg-gradient-to-br ${project.gradient} flex items-center justify-center text-5xl relative overflow-hidden`}
              >
                {project.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    <button
                      onClick={() => handleImageClick(project)}
                      className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-300 cursor-pointer"
                      aria-label={`Preview ${project.title} image`}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs font-medium flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                        View Image
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/5 transition-opacity duration-300" />
                    <span role="img" aria-label={project.title}>{project.emoji}</span>
                  </>
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-5">
                <h3 className="font-semibold text-lg text-white mb-2 group-hover:gradient-text transition-all duration-200">
                  {project.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <a
                    href={project.githubUrl}
                    className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <GithubIcon />
                    GitHub
                  </a>
                  <span className="text-white/15">|</span>
                  <a
                    href={project.liveUrl}
                    className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} live demo`}
                  >
                    <ExternalLinkIcon />
                    Live Demo
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>


      </div>

      {/* Bat jumpscare */}
      {showJumpscare && <JumpscareOverlay onDone={handleJumpscareDone} />}

      {/* Image lightbox modal */}
      {modalImage && (
        <ImageModal
          src={modalImage.src}
          title={modalImage.title}
          onClose={() => setModalImage(null)}
        />
      )}
    </section>
  );
}
