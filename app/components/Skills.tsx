type Skill = {
  name: string;
  icon: string;
};

type SkillCategory = {
  title: string;
  subtitle: string;
  gradient: string;
  headerGradient: string;
  iconBg: string;
  accentBorder: string;
  icon: string;
  skills: Skill[];
};

const skillCategories: SkillCategory[] = [
  {
    title: "Technical Skills",
    subtitle: "Languages & tools I build with",
    gradient: "from-yellow-400 to-blue-500",
    headerGradient: "from-yellow-400/15 to-blue-500/10",
    iconBg: "bg-yellow-400/10 border-yellow-400/20",
    accentBorder: "border-yellow-400/20",
    icon: "💻",
    skills: [
      { name: "Java", icon: "☕" },
      { name: "Python", icon: "🐍" },
      { name: "C#", icon: "🔷" },
      { name: "Social Media", icon: "📱" },
      { name: "Graphics Design", icon: "🎨" },
    ],
  },
  {
    title: "Non-Technical Skills",
    subtitle: "Soft skills & professional strengths",
    gradient: "from-blue-500 to-yellow-400",
    headerGradient: "from-blue-500/15 to-yellow-400/10",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    accentBorder: "border-blue-500/20",
    icon: "🧠",
    skills: [
      { name: "Critical Thinking", icon: "💡" },
      { name: "Leadership", icon: "🏆" },
      { name: "Adaptability", icon: "🔄" },
      { name: "Time Management", icon: "⏱️" },
      { name: "Communication Skills", icon: "🗣️" },
    ],
  },
];

/* Progress bar fill per skill — purely decorative visual weight */
const skillLevels: Record<string, number> = {
  Java: 80,
  Python: 75,
  "C#": 70,
  "Social Media": 90,
  "Graphics Design": 85,
  "Critical Thinking": 95,
  Leadership: 88,
  Adaptability: 92,
  "Time Management": 85,
  "Communication Skills": 90,
};

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 relative">
      {/* Section divider accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 mb-4">
            What I Bring
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Skills &{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-blue-500 bg-clip-text text-transparent">Competencies</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base">
            A blend of technical expertise and professional strengths that I bring to every project and team.
          </p>
        </div>

        {/* Two-column skill cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="gradient-border overflow-hidden hover:scale-[1.01] transition-transform duration-300 group"
            >
              {/* Card header with gradient */}
              <div
                className={`px-6 py-5 bg-gradient-to-r ${category.headerGradient} border-b border-white/5`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${category.iconBg}`}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-base bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}
                    >
                      {category.title}
                    </h3>
                    <p className="text-xs text-white/35">{category.subtitle}</p>
                  </div>
                  <span className="ml-auto text-xs font-medium text-white/25 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/8">
                    {category.skills.length} skills
                  </span>
                </div>
              </div>

              {/* Skills list with progress bars */}
              <div className="p-6 flex flex-col gap-4">
                {category.skills.map((skill) => {
                  const level = skillLevels[skill.name] ?? 75;
                  return (
                    <div key={skill.name} className="group/skill">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{skill.icon}</span>
                          <span className="text-sm font-medium text-white/80 group-hover/skill:text-white transition-colors duration-200">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-xs text-white/30 tabular-nums">{level}%</span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${category.gradient} transition-all duration-700`}
                          style={{ width: `${level}%` }}
                          role="progressbar"
                          aria-valuenow={level}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${skill.name} proficiency: ${level}%`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer badge strip */}
              <div className="px-6 pb-5">
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className={`px-3 py-1 rounded-full text-xs border bg-white/3 text-white/50 hover:text-white hover:bg-white/8 transition-all duration-200 cursor-default ${category.accentBorder}`}
                    >
                      {skill.icon} {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
