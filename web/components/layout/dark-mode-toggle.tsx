"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = stored === "dark" || (!stored && prefersDark);
  if (isDark) {
    document.documentElement.classList.add("dark");
  }
  return isDark;
}

export function DarkModeToggle() {
  const [dark, setDark] = useState(getInitialDark);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}
