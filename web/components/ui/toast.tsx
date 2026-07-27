"use client";

import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Clean up all timers on unmount
  useEffect(() => {
    const timers = timerRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    const timerId = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timerRef.current.delete(id);
    }, 4000);
    timerRef.current.set(id, timerId);
  }, []);

  const removeToast = useCallback((id: string) => {
    const timer = timerRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timerRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast container: portal to document.body could be added but simpler inline */}
      {toasts.length > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              role="alert"
              className={cn(
                "pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-300",
                t.type === "success" && "bg-emerald-600 text-white",
                t.type === "error" && "bg-destructive text-destructive-foreground",
                t.type === "info" && "bg-primary text-primary-foreground",
              )}
            >
              {t.type === "success" && <CheckCircle className="size-4 shrink-0" />}
              {t.type === "error" && <AlertCircle className="size-4 shrink-0" />}
              {t.type === "info" && <Info className="size-4 shrink-0" />}
              <span className="flex-1">{t.message}</span>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="ml-1 shrink-0 rounded-full p-1 hover:bg-white/20"
                aria-label="Cerrar"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
