import { useEffect, useState, type JSX } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

function getInitialDarkMode(): boolean {
  // Read what the inline script already applied to <html>
  // This is the single source of truth on mount — no localStorage race
  return document.documentElement.classList.contains("dark");
}

export default function DarkModeToggle(): JSX.Element {
  const [isDark, setIsDark] = useState<boolean>(false);

  // Sync initial state from the DOM (what the inline script set)
  // Only runs client-side, after hydration — eliminates the race
  useEffect(() => {
    setIsDark(getInitialDarkMode());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("dark-mode", isDark.toString());
  }, [isDark]);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="mode-toggle"
        checked={isDark} // controlled — stays in sync
        onCheckedChange={setIsDark} // proper Radix handler
        aria-label="Toggle dark mode"
      />
      <Label htmlFor="mode-toggle">{isDark ? "Light Mode" : "Dark Mode"}</Label>
    </div>
  );
}
