"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("marketlens-theme");
    const useDark = saved ? saved === "dark" : true;
    document.documentElement.dataset.theme = useDark ? "dark" : "light";
    // Hydrate the client-only preference once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(useDark);
    setReady(true);
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("marketlens-theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>
      {dark ? <Sun size={16} /> : <Moon size={16} />}
      <span>{ready && (dark ? "Light" : "Dark")}</span>
    </button>
  );
}
