import { Link } from "react-router";

export function Hero() {
  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 z-0">
      {/* ── Decorative background ─────────────────────────────────────── */}
      {/* pointer-events-none keeps these out of the hit-test tree entirely */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Ring 1 — 25 s spin, GPU-composited via will-change-transform */}
        <div className="absolute top-1/4 -left-64 w-96 h-96 rounded-full border-[40px] border-amber-500/10 dark:border-amber-600/20 animate-spin-slow will-change-transform" />

        {/* Ring 2 — slower 40 s spin, expressed as an arbitrary Tailwind duration */}
        <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] rounded-full border-[60px] border-orange-400/10 dark:border-red-700/10 animate-spin-slow will-change-transform [animation-duration:40s]" />

        {/* Ambient orb — blur is expensive; will-change-transform promotes it */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-red-600 blur-3xl opacity-10 dark:opacity-20 will-change-transform" />
      </div>

      {/* Light-mode gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/50 to-zinc-100/80 dark:from-transparent dark:via-transparent dark:to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Noise texture — defined once in CSS as .hero-noise, no per-render allocation */}
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
            Qualified Teacher • 15+ Years Experience
          </span>
        </div>

        {/* Headline — hero-display class carries font-family + line-height */}
        <h1 className="hero-display text-7xl md:text-9xl font-black tracking-tighter mb-6 animate-slide-up text-zinc-900 dark:text-zinc-50">
          <span className="block text-amber-600 dark:text-amber-500 drop-shadow-[0_4px_12px_rgba(217,119,6,0.3)]">
            AMPLIFY
          </span>
          <span className="block">YOUR SOUND</span>
        </h1>

        {/* Subheading — hero-mono class carries font-family */}
        <p className="hero-mono text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in [animation-delay:0.2s]">
          Master guitar &amp; bass with personalized lessons designed to unlock
          your potential — from first chord to stage-ready solos.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in [animation-delay:0.4s]">
          <Link
            to="/contact"
            className="group relative px-8 py-4 bg-amber-600 hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500 transition-all duration-300 font-bold text-lg tracking-wide overflow-hidden rounded-sm text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/20"
          >
            <span className="hero-mono relative z-10">START NOW</span>
            {/* Slide-in hover layer — transform only, GPU-composited */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 dark:from-red-600 dark:to-amber-600 translate-x-full group-hover:translate-x-0 transition-transform duration-500 will-change-transform" />
          </Link>

          <Link
            to="/contact"
            type="button"
            className="hero-mono px-8 py-4 border-2 border-zinc-300 hover:border-amber-500 hover:bg-amber-500/5 dark:border-zinc-700 dark:hover:border-amber-600 dark:hover:bg-amber-600/10 transition-all duration-300 font-bold text-lg tracking-wide rounded-sm text-zinc-800 dark:text-zinc-200"
          >
            VIEW PRICING
          </Link>
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
      </div>
    </header>
  );
}
