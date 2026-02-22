import { Link } from "react-router";

export function LessonsHero() {
  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 z-0">
      {/* ── Decorative background ─────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Two rings — one per instrument */}
        <div className="absolute top-1/3 -left-48 w-80 h-80 rounded-full border-[36px] border-amber-500/10 dark:border-amber-600/20 animate-spin-slow will-change-transform" />
        <div className="absolute bottom-1/3 -right-48 w-[520px] h-[520px] rounded-full border-[50px] border-orange-400/10 dark:border-red-700/10 animate-spin-slow will-change-transform [animation-duration:45s]" />

        {/* Dividing line — subtle vertical rule */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-px w-px bg-gradient-to-b from-transparent via-amber-500/20 to-transparent hidden lg:block" />

        {/* Ambient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-red-600 blur-3xl opacity-10 dark:opacity-20 will-change-transform" />
      </div>

      {/* Light-mode gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/50 to-zinc-100/80 dark:from-transparent dark:via-transparent dark:to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Noise texture */}
      <div
        className="hero-noise absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none"
        aria-hidden="true"
      />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 dark:bg-amber-600/10 border border-amber-500/30 dark:border-amber-600/30 backdrop-blur-sm mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-500 animate-pulse" />
          <span className="text-sm tracking-wider uppercase text-amber-700 dark:text-amber-500 font-medium">
            Guitar &amp; Bass Lessons
          </span>
        </div>

        {/* Headline */}
        <h1 className="hero-display text-6xl md:text-8xl font-black tracking-tighter mb-6 animate-slide-up text-zinc-900 dark:text-zinc-50">
          <span className="block">CHOOSE YOUR</span>
          <span className="block text-amber-600 dark:text-amber-500 drop-shadow-[0_4px_12px_rgba(217,119,6,0.3)]">
            INSTRUMENT
          </span>
        </h1>

        {/* Subheading */}
        <p className="hero-mono text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-16 leading-relaxed animate-fade-in [animation-delay:0.2s]">
          Whether you're drawn to riffs or roots, every great player starts with
          one decision. Pick your path and let's build something real.
        </p>

        {/* Instrument split cards */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16 animate-fade-in [animation-delay:0.3s]">
          {/* Guitar card */}
          <Link
            to="/lessons/guitar"
            className="group relative flex flex-col items-center gap-4 p-8 border-2 border-zinc-200 dark:border-zinc-800 rounded-sm hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-500/5 dark:hover:bg-amber-500/5 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/10 dark:group-hover:from-amber-500/10 dark:group-hover:to-orange-600/5 transition-all duration-500 will-change-transform" />
            {/* Icon placeholder — swap with your SVG */}
            <div className="relative w-16 h-16 rounded-full bg-amber-500/10 dark:bg-amber-600/10 flex items-center justify-center border border-amber-500/20 dark:border-amber-600/20 group-hover:scale-110 transition-transform duration-300 will-change-transform">
              <span className="hero-mono text-2xl font-black text-amber-600 dark:text-amber-500">
                G
              </span>
            </div>
            <div className="relative text-center">
              <p className="hero-display text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-1">
                GUITAR
              </p>
              <p className="hero-mono text-sm text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
                Chords · Riffs · Lead · Rhythm
              </p>
            </div>
            <div className="relative hero-mono text-xs font-bold tracking-widest uppercase text-amber-600 dark:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Explore →
            </div>
          </Link>

          {/* Bass card */}
          <Link
            to="/lessons/bass"
            className="group relative flex flex-col items-center gap-4 p-8 border-2 border-zinc-200 dark:border-zinc-800 rounded-sm hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-500/5 dark:hover:bg-amber-500/5 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/10 dark:group-hover:from-orange-600/10 dark:group-hover:to-red-700/5 transition-all duration-500 will-change-transform" />
            <div className="relative w-16 h-16 rounded-full bg-amber-500/10 dark:bg-amber-600/10 flex items-center justify-center border border-amber-500/20 dark:border-amber-600/20 group-hover:scale-110 transition-transform duration-300 will-change-transform">
              <span className="hero-mono text-2xl font-black text-amber-600 dark:text-amber-500">
                B
              </span>
            </div>
            <div className="relative text-center">
              <p className="hero-display text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-1">
                BASS
              </p>
              <p className="hero-mono text-sm text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
                Groove · Pocket · Slap · Theory
              </p>
            </div>
            <div className="relative hero-mono text-xs font-bold tracking-widest uppercase text-amber-600 dark:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Explore →
            </div>
          </Link>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in [animation-delay:0.5s]">
          <Link
            to="/contact"
            className="group relative px-8 py-4 bg-amber-600 hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500 transition-all duration-300 font-bold text-lg tracking-wide overflow-hidden rounded-sm text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/20"
          >
            <span className="hero-mono relative z-10">BOOK A LESSON</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 dark:from-red-600 dark:to-amber-600 translate-x-full group-hover:translate-x-0 transition-transform duration-500 will-change-transform" />
          </Link>
          <Link
            to="/contact"
            className="hero-mono px-8 py-4 border-2 border-zinc-300 hover:border-amber-500 hover:bg-amber-500/5 dark:border-zinc-700 dark:hover:border-amber-600 dark:hover:bg-amber-600/10 transition-all duration-300 font-bold text-lg tracking-wide rounded-sm text-zinc-800 dark:text-zinc-200"
          >
            VIEW PRICING
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-zinc-300 dark:border-zinc-700 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-amber-600 dark:bg-amber-500 rounded-full" />
        </div>
      </div>
    </header>
  );
}
