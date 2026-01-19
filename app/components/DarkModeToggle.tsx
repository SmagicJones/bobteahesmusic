import { useEffect, useState, type JSX } from "react";

import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export default function DarkModeToggle(): JSX.Element {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dark-mode");
      if (saved !== null) return saved === "true";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("dark-mode", isDark.toString());
  }, [isDark]);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="mode-toggle"
        onClick={() => setIsDark(!isDark)}
        aria-label="Toggle dark mode"
      ></Switch>
      <Label htmlFor="mode-toggle">{isDark ? "Light Mode" : "Dark Mode"}</Label>
    </div>
  );
}
