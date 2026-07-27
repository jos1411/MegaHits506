import { describe, expect, it } from "vitest";

import {
  MOCK_EVENTS,
  MOCK_PHOTOS,
  MOCK_VIDEOS,
  getEventBySlug,
  getEvents,
  getPhotos,
  getVideos,
} from "@/lib/data";

describe("mock data", () => {
  describe("MOCK_PHOTOS", () => {
    it("contains 8 photos", () => {
      expect(MOCK_PHOTOS).toHaveLength(8);
    });

    it("each photo has required fields", () => {
      for (const photo of MOCK_PHOTOS) {
        expect(photo).toHaveProperty("id");
        expect(photo).toHaveProperty("url");
        expect(photo).toHaveProperty("created_at");
      }
    });
  });

  describe("MOCK_VIDEOS", () => {
    it("contains 3 videos", () => {
      expect(MOCK_VIDEOS).toHaveLength(3);
    });

    it("each video has a youtube_id", () => {
      for (const video of MOCK_VIDEOS) {
        expect(video.youtube_id).toBeTruthy();
        expect(video.title).toBeTruthy();
      }
    });
  });

  describe("MOCK_EVENTS", () => {
    it("contains 5 events", () => {
      expect(MOCK_EVENTS).toHaveLength(5);
    });

    it("each event has required fields", () => {
      for (const event of MOCK_EVENTS) {
        expect(event).toHaveProperty("id");
        expect(event).toHaveProperty("slug");
        expect(event).toHaveProperty("title");
        expect(event).toHaveProperty("event_date");
        expect(event).toHaveProperty("location");
      }
    });
  });

  describe("async helpers", () => {
    it("getPhotos returns all photos", async () => {
      const photos = await getPhotos();
      expect(photos).toEqual(MOCK_PHOTOS);
    });

    it("getVideos returns all videos", async () => {
      const videos = await getVideos();
      expect(videos).toEqual(MOCK_VIDEOS);
    });

    it("getEvents returns all events", async () => {
      const events = await getEvents();
      expect(events).toEqual(MOCK_EVENTS);
    });

    it("getEventBySlug returns the correct event", async () => {
      const event = await getEventBySlug("boda-marta-carlos");
      expect(event).toBeDefined();
      expect(event?.title).toBe("Boda de Marta y Carlos");
    });

    it("getEventBySlug returns undefined for unknown slug", async () => {
      const event = await getEventBySlug("non-existent");
      expect(event).toBeUndefined();
    });
  });
});
