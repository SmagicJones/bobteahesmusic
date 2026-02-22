import { Link } from "react-router";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="relative bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-500 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full border-[30px] border-amber-600/30"></div>
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[20px] border-amber-500/20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Column 1: About */}
        <div>
          <Link
            to="/"
            className="inline-block text-2xl font-black text-zinc-900 dark:text-zinc-50 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-300 mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            bobteachesmusic
          </Link>
          <p
            className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Guitar and Bass Lessons for Everyone — From your first chord to
            stage-ready performances.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-600 dark:bg-amber-500 rounded-full animate-pulse"></div>
            <span
              className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wider font-medium"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              15+ Years Teaching
            </span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4
            className="text-lg font-black mb-4 text-zinc-900 dark:text-zinc-50"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Quick Links
          </h4>
          <ul className="space-y-3">
            {[
              { to: "/", label: "Home", icon: "🏠" },
              { to: "/lessons/guitar", label: "Guitar Lessons", icon: "🎸" },
              { to: "/lessons/bass", label: "Bass Lessons", icon: "🎸" },
              { to: "/contact", label: "Contact", icon: "📧" },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="group flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-300"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  <span className="text-base opacity-70 group-hover:opacity-100 transition-opacity">
                    {link.icon}
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Feedback / CTA */}
        <div>
          <h4
            className="text-lg font-black mb-4 text-zinc-900 dark:text-zinc-50"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Get in Touch
          </h4>
          <p
            className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Have questions? Want to book a lesson? We'd love to hear from you
            and help you on your musical journey.
          </p>
          <Button
            asChild
            className="w-full bg-amber-600 hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold tracking-wide shadow-lg hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="relative z-10 border-t border-zinc-200 dark:border-zinc-800 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p
              className="text-sm text-zinc-600 dark:text-zinc-500 text-center md:text-left"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              &copy; {new Date().getFullYear()} bobteachesmusic. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/privacy"
                className="text-xs text-zinc-500 dark:text-zinc-500 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-300"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Privacy
              </Link>
              <span className="text-zinc-400 dark:text-zinc-600">•</span>
              <Link
                to="/terms"
                className="text-xs text-zinc-500 dark:text-zinc-500 hover:text-amber-600 dark:hover:text-amber-500 transition-colors duration-300"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
