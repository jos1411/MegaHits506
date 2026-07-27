"use client";

import { cn } from "@/lib/utils";

interface EqualizerProps {
  active?: boolean;
  className?: string;
}

const BAR_COUNT = 4;

export function Equalizer({ active = true, className }: EqualizerProps) {
  return (
    <span
      className={cn("inline-flex items-end gap-px", className)}
      aria-hidden="true"
      role="presentation"
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "inline-block w-[3px] rounded-full bg-primary",
            active && "animate-eq-bar-fade",
          )}
          style={{
            height: active ? undefined : "40%",
            animationDelay: active ? `${i * 0.15}s` : undefined,
            animationDuration: active ? `${0.6 + i * 0.1}s` : undefined,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes eq-bar-fade {
          0%,
          100% {
            height: 30%;
          }
          50% {
            height: 100%;
          }
        }
        .animate-eq-bar-fade {
          animation: eq-bar-fade linear infinite alternate;
        }
      `}</style>
    </span>
  );
}
