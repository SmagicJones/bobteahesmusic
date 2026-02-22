import { Link } from "react-router";

const BASS_SKILLS = [
  { label: "Fingerstyle", detail: "Tone, attack & feel" },
  { label: "Slap & Pop", detail: "Funk, groove & snap" },
  { label: "Walking Bass", detail: "Jazz lines & harmony" },
  { label: "Rhythm & Pocket", detail: "Lock with the drummer" },
  { label: "Music Theory", detail: "Intervals, modes & charts" },
  { label: "Genre Styles", detail: "Rock, funk, jazz & more" },
];

export function BassLessonsHero() {
  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 z-0">
      {/* ── Decorative background ─────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Larger, slower rings — bass feels deep and weighty */}
        <div className="absolute top-1/4 -left-72 w-[480px] h-[480px] rounded-full border-[50px] border-orange-500/10 dark:border-orange-700/20 animate-spin-slow will-change-transform [animation-duration:50s]" />
        <div className="absolute bottom-1/4 -right-72 w-[700px] h-[700px] rounded-full border-[70px] border-red-400/10 dark:border-red-800/10 animate-spin-slow will-change-transform [animation-duration:65s] [animation-direction:reverse]" />

        {/* Deeper-hued ambient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 blur-3xl opacity-10 dark:opacity-20 will-change-transform" />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/50 to-zinc-100/80 dark:from-transparent dark:via-transparent dark:to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="hero-noise absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 dark:bg-orange-700/10 border border-orange-500/30 dark:border-orange-700/30 backdrop-blur-sm mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-500 animate-pulse" />
          <span className="text-sm tracking-wider uppercase text-orange-700 dark:text-orange-500 font-medium">
            Bass Lessons · Feel the Foundation
          </span>
        </div>

        {/* Headline */}
        <h1 className="hero-display text-7xl md:text-9xl font-black tracking-tighter mb-6 animate-slide-up text-zinc-900 dark:text-zinc-50">
          <span className="block text-orange-600 dark:text-orange-500 drop-shadow-[0_4px_12px_rgba(234,88,12,0.3)]">
            BASS
          </span>
          <span className="block">LESSONS</span>
        </h1>

        {/* Subheading */}
        <p className="hero-mono text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-14 leading-relaxed animate-fade-in [animation-delay:0.2s]">
          The backbone of every great band. Learn to hold the groove, command
          the low end, and become the player every musician wants in the room.
        </p>

        {/* Skills grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-14 animate-fade-in [animation-delay:0.3s]">
          {BASS_SKILLS.map(({ label, detail }) => (
            <div
              key={label}
              className="flex flex-col items-start gap-1 px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm text-left"
            >
              <span className="hero-mono text-xs font-bold tracking-widest uppercase text-orange-600 dark:text-orange-500">
                {label}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-500">
                {detail}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in [animation-delay:0.5s]">
          <Link
            to="/contact"
            className="group relative px-8 py-4 bg-orange-600 hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500 transition-all duration-300 font-bold text-lg tracking-wide overflow-hidden rounded-sm text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/20"
          >
            <span className="hero-mono relative z-10">START BASS NOW</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-700 dark:to-orange-600 translate-x-full group-hover:translate-x-0 transition-transform duration-500 will-change-transform" />
          </Link>
          <Link
            to="/lessons"
            className="hero-mono px-8 py-4 border-2 border-zinc-300 hover:border-orange-500 hover:bg-orange-500/5 dark:border-zinc-700 dark:hover:border-orange-600 dark:hover:bg-orange-600/10 transition-all duration-300 font-bold text-lg tracking-wide rounded-sm text-zinc-800 dark:text-zinc-200"
          >
            ALL LESSONS
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-zinc-300 dark:border-zinc-700 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-orange-600 dark:bg-orange-500 rounded-full" />
        </div>
      </div>
    </header>
  );
}
