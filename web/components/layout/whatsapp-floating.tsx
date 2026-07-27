"use client";

import { MessageCircle } from "lucide-react";

import { WHATSAPP_URL } from "@/lib/constants";

export function WhatsAppFloating() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
