import { Link } from "react-router";
import { guitarCharts, type GuitarChart } from "~/data/guitar/charts";
import { bassCharts, type BassChart } from "~/data/bass/charts";

// ── Download card ──────────────────────────────────────────────────────────────
function ChartCard({
  title,
  intro,
  comment,
  download_url,
  accent = "amber",
}: {
  title: string;
  intro: string;
  comment?: string;
  download_url: string;
  accent?: "amber" | "orange";
}) {
  const accentClasses =
    accent === "orange"
      ? {
          badge:
            "text-orange-600 dark:text-orange-500 border-orange-500/30 dark:border-orange-600/30 bg-orange-500/5 dark:bg-orange-600/10",
          hover: "hover:border-orange-500 dark:hover:border-orange-500",
          btn: "bg-orange-600 hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-500 shadow-orange-500/20 hover:shadow-orange-500/30",
          overlay:
            "from-red-600 to-orange-500 dark:from-red-700 dark:to-orange-600",
          dot: "bg-orange-600 dark:bg-orange-500",
        }
      : {
          badge:
            "text-amber-700 dark:text-amber-500 border-amber-500/30 dark:border-amber-600/30 bg-amber-500/5 dark:bg-amber-600/10",
          hover: "hover:border-amber-500 dark:hover:border-amber-500",
          btn: "bg-amber-600 hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500 shadow-amber-500/20 hover:shadow-amber-500/30",
          overlay:
            "from-orange-600 to-amber-500 dark:from-red-600 dark:to-amber-600",
          dot: "bg-amber-600 dark:bg-amber-500",
        };

  return (
    <div
      className={`group relative flex flex-col border border-zinc-200 dark:border-zinc-800 ${accentClasses.hover} bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-sm transition-all duration-300 overflow-hidden`}
    >
      {/* Top accent line */}
      <div
        className={`h-px w-0 group-hover:w-full transition-all duration-500 ${accentClasses.dot === "bg-amber-600 dark:bg-amber-500" ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-orange-500 to-red-500"}`}
      />

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h3 className="hero-display text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            {title}
          </h3>
          <p className="hero-mono text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Comment */}
        {comment && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
            {comment}
          </p>
        )}

        {/* Download CTA */}
        <a
          href={download_url}
          download
          className={`group/btn relative mt-auto self-start flex items-center gap-3 px-5 py-3 ${accentClasses.btn} text-white font-bold tracking-wide text-sm rounded-sm overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl`}
        >
          <span className="hero-mono relative z-10 flex items-center gap-2">
            {/* Down arrow icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover/btn:translate-y-0.5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            FREE DOWNLOAD
          </span>
          <div
            className={`absolute inset-0 bg-gradient-to-r ${accentClasses.overlay} translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 will-change-transform`}
          />
        </a>
      </div>
    </div>
  );
}

// ── Section label ──────────────────────────────────────────────────────────────
function SectionLabel({ label, to }: { label: string; to: string }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="h-px w-12 bg-amber-500/40" />
        <span className="hero-mono text-xs font-bold tracking-widest uppercase text-amber-600 dark:text-amber-500">
          {label}
        </span>
      </div>
      <Link
        to={to}
        className="hero-mono text-xs font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-200"
      >
        VIEW ALL →
      </Link>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function FreeStuffPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="relative flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 pt-24 pb-20 z-0">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-0 -left-48 w-80 h-80 rounded-full border-[36px] border-amber-500/10 dark:border-amber-600/20 animate-spin-slow will-change-transform" />
          <div className="absolute bottom-0 -right-48 w-[520px] h-[520px] rounded-full border-[50px] border-orange-400/10 dark:border-red-700/10 animate-spin-slow will-change-transform [animation-duration:45s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-red-600 blur-3xl opacity-10 dark:opacity-20 will-change-transform" />
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/50 to-zinc-100/80 dark:from-transparent dark:via-transparent dark:to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="hero-noise absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 dark:bg-amber-600/10 border border-amber-500/30 dark:border-amber-600/30 backdrop-blur-sm mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-500 animate-pulse" />
            <span className="text-sm tracking-wider uppercase text-amber-700 dark:text-amber-500 font-medium">
              Free Downloads · Guitar &amp; Bass
            </span>
          </div>

          <h1 className="hero-display text-7xl md:text-9xl font-black tracking-tighter mb-6 animate-slide-up text-zinc-900 dark:text-zinc-50">
            <span className="block text-amber-600 dark:text-amber-500 drop-shadow-[0_4px_12px_rgba(217,119,6,0.3)]">
              FREE
            </span>
            <span className="block">STUFF</span>
          </h1>

          <p className="hero-mono text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed animate-fade-in [animation-delay:0.2s]">
            Charts, references, and resources to keep on your stand, tape to
            your wall, or save to your phone — all free, no catch.
          </p>

          {/* Instrument jump links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 animate-fade-in [animation-delay:0.4s]">
            <a
              href="#guitar"
              className="group relative px-8 py-4 bg-amber-600 hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500 transition-all duration-300 font-bold text-lg tracking-wide overflow-hidden rounded-sm text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/20"
            >
              <span className="hero-mono relative z-10">GUITAR CHARTS</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 dark:from-red-600 dark:to-amber-600 translate-x-full group-hover:translate-x-0 transition-transform duration-500 will-change-transform" />
            </a>
            <a
              href="#bass"
              className="hero-mono px-8 py-4 border-2 border-zinc-300 hover:border-amber-500 hover:bg-amber-500/5 dark:border-zinc-700 dark:hover:border-amber-600 dark:hover:bg-amber-600/10 transition-all duration-300 font-bold text-lg tracking-wide rounded-sm text-zinc-800 dark:text-zinc-200"
            >
              BASS CHARTS
            </a>
          </div>
        </div>
      </header>

      {/* ── Chart sections ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        {/* Guitar */}
        <section id="guitar">
          <SectionLabel label="Guitar Charts" to="/free-stuff/guitar" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {guitarCharts.map((chart: GuitarChart) => (
              <ChartCard
                key={chart.download_url}
                title={chart.title}
                intro={chart.intro}
                comment={chart.comment}
                download_url={chart.download_url}
                accent="amber"
              />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-6" aria-hidden="true">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-amber-500/40" />
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {/* Bass */}
        <section id="bass">
          <SectionLabel label="Bass Charts" to="/free-stuff/bass" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {bassCharts.map((chart: BassChart) => (
              <ChartCard
                key={chart.download_url}
                title={chart.title}
                intro={chart.intro}
                comment={chart.comment}
                download_url={chart.download_url}
                accent="orange"
              />
            ))}
          </div>
        </section>
      </div>

      {/* ── Footer CTA ────────────────────────────────────────────────────── */}
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="hero-mono text-sm tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-4">
            Want more personalised resources?
          </p>
          <Link
            to="/contact"
            className="group relative inline-flex px-8 py-4 bg-amber-600 hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500 transition-all duration-300 font-bold text-lg tracking-wide overflow-hidden rounded-sm text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/20"
          >
            <span className="hero-mono relative z-10">BOOK A LESSON</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 dark:from-red-600 dark:to-amber-600 translate-x-full group-hover:translate-x-0 transition-transform duration-500 will-change-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}

// import { bassCharts, type BassChart } from "~/data/bass/charts";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "~/components/ui/card";

// export default function FreeStuff() {
//   return (
//     <main>
//       <header className="flex justify-center items-center p-4">
//         <div className="">
//           <h1 className="text-2xl">Free Stuff!!!</h1>
//         </div>
//       </header>

//       <section>
//         <div className="grid md:grid-cols-2 gap-4 m-2">
//           {bassCharts.map((chart: BassChart) => (
//             <Card>
//               <CardHeader>
//                 <CardTitle>{chart.title}</CardTitle>
//                 <CardDescription>{chart.intro}</CardDescription>
//               </CardHeader>
//               <CardContent>{chart.comment}</CardContent>
//               <CardFooter>
//                 <a href={chart.download_url}>Download Now!</a>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }
