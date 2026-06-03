type EducationItem = {
  degree: string;
  field: string;
  institution: string;
  location: string;
  dateRange: string;
  status: string;
  type: "degree" | "certification";
  accentColor: string;
  headerGradient: string;
  borderAccent: string;
  summary: string;
  /** Optional academic distinction badge (e.g. "With High Honor") */
  distinction?: string;
  /** Show OJT/internship CTA footer */
  showOjtFooter?: boolean;
};

const educationData: EducationItem[] = [
  {
    degree: "Bachelor of Science in Information Technology",
    field: "BSIT — Web & Mobile Technologies",
    institution: "STI College Tanay",
    location: "Tanay, Rizal",
    dateRange: "2023 – 2026",
    status: "3rd Year · In Progress",
    type: "degree",
    accentColor: "purple",
    headerGradient: "from-yellow-400/20 via-blue-500/15 to-transparent",
    borderAccent: "border-yellow-400/30",
    distinction: "With High Honor",
    summary:
      "Currently completing the third year of a four-year BSIT program with a strong technical focus on full-stack web development, mobile application design, backend integration, and relational database management.",
    showOjtFooter: true,
  },
  {
    degree: "Senior High School — TVL Track",
    field: "Mobile App and Web Development (MAWD)",
    institution: "STI College Tanay",
    location: "Tanay, Rizal",
    dateRange: "2021 – 2023",
    status: "Graduated · Grade 11–12",
    type: "certification",
    accentColor: "cyan",
    headerGradient: "from-yellow-400/20 via-blue-500/15 to-transparent",
    borderAccent: "border-blue-500/30",
    distinction: "With High Honor",
    summary:
      "Completed the TVL–MAWD strand with academic distinction, building a solid technical foundation in web design principles, introductory programming logic, object-oriented concepts, and user interface layout — the direct precursor to college-level full-stack development.",
  },
  {
    degree: "Junior High School",
    field: "General Education — Grade 7 to 10",
    institution: "St. Therese School",
    location: "Tanay, Rizal",
    dateRange: "2017 – 2021",
    status: "Graduated · Grade 7–10",
    type: "certification",
    accentColor: "violet",
    headerGradient: "from-white/15 via-white/5 to-transparent",
    borderAccent: "border-white/20",
    distinction: "With High Honor",
    summary:
      "Completed four years of Junior High School with consistent academic distinction, developing a strong foundation in mathematics, science, and analytical reasoning — the core competencies that would later drive success in technical and IT studies.",
  },
];

type DotColorMap = { [key: string]: string };

const dotColors: DotColorMap = {
  purple: "bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]",
  cyan:   "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]",
  violet: "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]",
};

const typeBadgeColors: DotColorMap = {
  degree:        "text-purple-400 bg-purple-500/10 border-purple-500/20",
  certification: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

export default function Education() {
  return (
    <section id="education" className="py-24 px-6 relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-violet-500/50 to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto">
        {/* ── Section header ──────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-violet-400 bg-violet-500/10 border border-violet-500/20 mb-4">
            Academic Background
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Education &{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-blue-500 bg-clip-text text-transparent">Training</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base">
            Formal academic training that built the technical foundation behind every project I ship.
          </p>
        </div>

        {/* ── Timeline ────────────────────────────────────────────────── */}
        <div className="relative">
          <div
            className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/40 via-cyan-500/20 to-transparent"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-10">
            {educationData.map((item) => (
              <div
                key={item.institution + item.degree}
                className="relative pl-14"
              >
                {/* Timeline dot */}
                <div className="absolute left-5 top-6 -translate-x-1/2">
                  <div className={`w-3 h-3 rounded-full ${dotColors[item.accentColor]}`} />
                </div>

                {/* Card */}
                <div className="gradient-border overflow-hidden hover:scale-[1.005] transition-transform duration-300">

                  {/* Card header */}
                  <div className={`bg-gradient-to-r ${item.headerGradient} px-6 py-5 border-b border-white/5`}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-lg text-white leading-snug mb-0.5">
                          {item.degree}
                        </h3>
                        <p className={`text-sm font-medium ${item.accentColor === "cyan" ? "text-cyan-400" : item.accentColor === "violet" ? "text-white/60" : "text-purple-400"}`}>
                          {item.field}
                        </p>
                      </div>

                      {/* Badges column */}
                      <div className="flex flex-col items-start sm:items-end gap-1.5 flex-shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-md border font-semibold ${item.accentColor === "violet" ? "text-white/60 bg-white/5 border-white/15" : typeBadgeColors[item.type]}`}>
                          {item.type === "degree" ? "Degree" : item.accentColor === "violet" ? "Junior High School" : "Senior High School"}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-md border text-emerald-400 bg-emerald-500/10 border-emerald-500/20 font-medium">
                          {item.status}
                        </span>
                        {/* Academic distinction badge */}
                        {item.distinction && (
                          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border font-semibold text-amber-400 bg-amber-500/10 border-amber-500/25">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {item.distinction}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Institution row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-white/35 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        <span className="text-sm text-white/70 font-semibold">{item.institution}</span>
                      </div>
                      <span className="text-white/20">·</span>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs text-white/45">{item.location}</span>
                      </div>
                      <span className="text-white/20">·</span>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-white/45 tabular-nums">{item.dateRange}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card body — summary */}
                  <div className="px-6 py-5">
                    <p className={`text-sm text-white/55 leading-relaxed border-l-2 ${item.borderAccent} pl-3`}>
                      {item.summary}
                    </p>
                  </div>

                  {/* Conditional footer */}
                  {item.showOjtFooter && (
                    <div className="px-6 py-4 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                        <p className="text-xs text-white/40">
                          Actively seeking{" "}
                          <span className="text-cyan-400 font-medium">host training establishment (HTE)</span>
                          {" "}opportunities for internship / On-the-Job Training (OJT) in 2025–2026.
                        </p>
                      </div>
                    </div>
                  )}

                  {item.distinction && (
                    <div className="px-6 py-4 bg-gradient-to-r from-amber-500/5 to-transparent border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <p className="text-xs text-white/40">
                          {item.type === "degree" ? "Maintaining" : "Graduated"}{" "}
                          <span className="text-amber-400 font-semibold">{item.distinction}</span>
                          {item.type === "degree"
                            ? " standing — demonstrating sustained academic excellence across all major BSIT coursework."
                            : " — recognizing consistent academic excellence and technical achievement throughout Grade 11–12."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
