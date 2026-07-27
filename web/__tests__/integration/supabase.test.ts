import { describe, expect, it } from "vitest";

const SKIP_REASON =
  "Supabase local instance not available — start with `supabase start` and set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY";

async function createClient() {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) return null;
    return createClient(url, key);
  } catch {
    return null;
  }
}

describe.runIf(!!process.env.NEXT_PUBLIC_SUPABASE_URL)(
  "Supabase integration",
  () => {
    it("connects to the database", async () => {
      const supabase = await createClient();
      expect(supabase).not.toBeNull();

      const { data, error } = await supabase!
        .from("photos")
        .select("id")
        .limit(1);

      // If the table doesn't exist yet, we get an error but the connection works
      if (error) {
        expect(error.message).toMatch(/relation|does not exist|permission/i);
      } else {
        expect(Array.isArray(data)).toBe(true);
      }
    });

    it("can read auth session status", async () => {
      const supabase = await createClient();
      expect(supabase).not.toBeNull();

      const { data } = await supabase!.auth.getSession();
      expect(data).toHaveProperty("session");
    });
  },
);

// Show skip notice when Supabase is not available
describe.skipIf(!!process.env.NEXT_PUBLIC_SUPABASE_URL)(
  "Supabase integration (skipped)",
  () => {
    it(SKIP_REASON, () => {
      // informational — test is skipped because Supabase is not running
    });
  },
);
