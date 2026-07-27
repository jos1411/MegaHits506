import { TIMEZONE } from "@/lib/constants";

const dateFormatter = new Intl.DateTimeFormat("es-CR", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("es-CR", {
  timeZone: TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(date: string | Date): string {
  return dateFormatter.format(new Date(date));
}

export function formatTime(date: string | Date): string {
  return timeFormatter.format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} · ${formatTime(date)}`;
}

export function isPastDate(date: string | Date): boolean {
  return new Date(date) < new Date();
}

export function isUpcomingDate(date: string | Date): boolean {
  return new Date(date) >= new Date();
}
