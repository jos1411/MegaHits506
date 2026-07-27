import { describe, expect, it } from "vitest";

import {
  AZURACAST_URL,
  ICECAST_STREAM_URL,
  NOW_PLAYING_REVALIDATE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  TIMEZONE,
  WHATSAPP_MESSAGE,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
} from "@/lib/constants";

describe("constants", () => {
  it("SITE_NAME is defined", () => {
    expect(SITE_NAME).toBe("Mega Hits 506");
  });

  it("SITE_DESCRIPTION is defined", () => {
    expect(SITE_DESCRIPTION).toContain("Pérez Zeledón");
  });

  it("SITE_URL is defined", () => {
    expect(SITE_URL).toContain("megahits506.com");
  });

  it("TIMEZONE is Costa Rica", () => {
    expect(TIMEZONE).toBe("America/Costa_Rica");
  });

  it("WHATSAPP_NUMBER has a placeholder", () => {
    expect(WHATSAPP_NUMBER).toBe("+506XXXXXXXX");
  });

  it("WHATSAPP_URL includes encoded message", () => {
    expect(WHATSAPP_URL).toContain(encodeURIComponent(WHATSAPP_MESSAGE));
  });

  it("NOW_PLAYING_REVALIDATE is a positive number", () => {
    expect(NOW_PLAYING_REVALIDATE).toBeGreaterThan(0);
  });

  it("ICECAST_STREAM_URL is undefined in test environment", () => {
    // env vars are not set in vitest by default
    expect(ICECAST_STREAM_URL).toBeUndefined();
  });

  it("AZURACAST_URL is undefined in test environment", () => {
    // env vars are not set in vitest by default
    expect(AZURACAST_URL).toBeUndefined();
  });
});
