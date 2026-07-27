"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function DarkModeToggle() {
  // Inicializamos siempre en false (modo claro) para que el HTML del servidor
  // y el primer render del cliente coincidan → sin hydration mismatch.
  const [dark, setDark] = useState(false);
  // Solo mostramos el ícono correcto DESPUÉS de montar en el cliente.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Leer el estado real del DOM (aplicado por el script inline antes del primer render)
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [dark]);

  // Evita hidratación incorrecta: no renderiza nada hasta montar
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled aria-label="Cargando tema">
        <Sun className="size-5" />
      </Button>
    );
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
