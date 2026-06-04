function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

const EMAIL = "ewmagpantay@gmail.com";
const LOCATION = "Tanay, Rizal";

export default function Contact() {
  return (
    <footer id="contact" className="py-24 px-6 relative">
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 mb-4">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Let&apos;s{" "}
            <span className="bg-gradient-to-r from-blue-500 to-yellow-400 bg-clip-text text-transparent">Work Together</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base">
            Have a project in mind or just want to say hello? My inbox is always open — I&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact card */}
        <div className="gradient-border p-8 md:p-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: contact info */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">
                Contact Information
              </h3>
              <div className="flex flex-col gap-5">
                {/* Email */}
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-4 group"
                  aria-label={`Send email to ${EMAIL}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors duration-200 flex-shrink-0">
                    <EmailIcon className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-sm text-white/70 group-hover:text-white transition-colors duration-200 break-all">
                      {EMAIL}
                    </p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <LocationIcon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-0.5">Location</p>
                    <p className="text-sm text-white/70">{LOCATION}</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-8">
                <p className="text-xs text-white/30 uppercase tracking-wider mb-4">
                  Connect with me
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/emmanwelt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/25 hover:bg-white/8 transition-all duration-200"
                    aria-label="GitHub profile"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.facebook.com/emman.welt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-sm text-white/50 hover:text-[#1877F2] hover:border-[#1877F2]/30 hover:bg-[#1877F2]/10 transition-all duration-200"
                    aria-label="Facebook profile"
                  >
                    <FacebookIcon className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: CTA card */}
            <div className="flex flex-col justify-center">
              <div className="rounded-xl bg-gradient-to-br from-yellow-400/10 to-blue-500/10 border border-white/8 p-6">
                <div className="text-3xl mb-4">👋</div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Ready to collaborate?
                </h4>
                <p className="text-sm text-white/50 leading-relaxed mb-6">
                  Whether you have an exciting project, a job opportunity, or just want to connect — I&apos;m always happy to chat.
                </p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 to-blue-500 text-white text-sm font-medium hover:opacity-90 hover:scale-105 transition-all duration-200"
                >
                  <EmailIcon className="w-4 h-4" />
                  Send an Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex items-center justify-center text-sm text-white/25">
          <p>© 2026 Emmanuel Welt Magpantay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
