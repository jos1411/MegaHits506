import type { Metadata } from "next";

import { RadioClient } from "@/components/radio/radio-client";

export const metadata: Metadata = {
  title: "Radio en Vivo | Mega Hits 506",
  description:
    "Escuchá Mega Hits 506 Radio en vivo, la mejor música para tus eventos.",
};

export default function RadioPage() {
  return <RadioClient />;
}
