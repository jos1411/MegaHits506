import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";
import {
  formatDate,
  formatDateTime,
  formatTime,
  isPastDate,
  isUpcomingDate,
} from "@/lib/utils/date";
import {
  emailSchema,
  eventSchema,
  loginSchema,
  passwordSchema,
  photoUploadSchema,
  youtubeUrlSchema,
} from "@/lib/utils/validation";

// ---------------------------------------------------------------------------
// cn()
// ---------------------------------------------------------------------------
describe("cn", () => {
  it("merges class names correctly", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "visible");
    expect(result).toBe("base visible");
  });

  it("resolves tailwind conflicts (last wins)", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});

// ---------------------------------------------------------------------------
// Date utilities
// ---------------------------------------------------------------------------
describe("date utils", () => {
  it("formatDate returns a Spanish date string", () => {
    const result = formatDate("2026-06-15T00:00:00Z");
    expect(result).toContain("junio");
    expect(result).toContain("2026");
  });

  it("formatTime returns a time string with hours and minutes", () => {
    const result = formatTime("2026-06-15T18:30:00Z");
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it("formatDateTime combines date and time", () => {
    const result = formatDateTime("2026-06-15T18:30:00Z");
    expect(result).toContain("·");
  });

  it("isPastDate returns true for old dates", () => {
    expect(isPastDate("2020-01-01")).toBe(true);
  });

  it("isUpcomingDate returns true for future dates", () => {
    expect(isUpcomingDate("2099-12-31")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------
describe("validation schemas", () => {
  describe("emailSchema", () => {
    it("accepts valid email", () => {
      expect(emailSchema.safeParse("user@example.com").success).toBe(true);
    });

    it("rejects invalid email", () => {
      expect(emailSchema.safeParse("notanemail").success).toBe(false);
    });
  });

  describe("passwordSchema", () => {
    it("accepts password with 6+ chars", () => {
      expect(passwordSchema.safeParse("123456").success).toBe(true);
    });

    it("rejects password shorter than 6 chars", () => {
      expect(passwordSchema.safeParse("12345").success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("accepts valid login data", () => {
      const result = loginSchema.safeParse({
        email: "admin@test.com",
        password: "secret123",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("youtubeUrlSchema", () => {
    it("accepts a YouTube watch URL", () => {
      expect(
        youtubeUrlSchema.safeParse("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
          .success,
      ).toBe(true);
    });

    it("rejects a non-YouTube URL", () => {
      expect(
        youtubeUrlSchema.safeParse("https://vimeo.com/123").success,
      ).toBe(false);
    });
  });

  describe("eventSchema", () => {
    it("accepts valid event data", () => {
      const result = eventSchema.safeParse({
        title: "Test Event",
        eventDate: "2026-07-01T18:00",
      });
      expect(result.success).toBe(true);
    });

    it("rejects event without title", () => {
      const result = eventSchema.safeParse({
        title: "",
        eventDate: "2026-07-01T18:00",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("photoUploadSchema", () => {
    it("rejects non-File input", () => {
      // Schema uses instanceof File, which is not satisfied by plain objects
      const result = photoUploadSchema.safeParse({
        file: { name: "test.jpg", type: "image/jpeg", size: 1000 },
      });
      expect(result.success).toBe(false);
    });
  });
});
