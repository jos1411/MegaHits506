export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      photos: {
        Row: {
          id: string;
          url: string;
          thumbnail_url: string | null;
          alt_text: string | null;
          caption: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["photos"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["photos"]["Insert"]>;
      };
      videos: {
        Row: {
          id: string;
          youtube_url: string;
          youtube_id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["videos"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["videos"]["Insert"]>;
      };
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          event_date: string;
          location: string | null;
          cover_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["events"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      event_photos: {
        Row: {
          event_id: string;
          photo_id: string;
        };
        Insert: Database["public"]["Tables"]["event_photos"]["Row"];
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience types for use across the app
export type Photo = Database["public"]["Tables"]["photos"]["Row"];
export type PhotoInsert = Database["public"]["Tables"]["photos"]["Insert"];
export type Video = Database["public"]["Tables"]["videos"]["Row"];
export type VideoInsert = Database["public"]["Tables"]["videos"]["Insert"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
export type EventPhoto = Database["public"]["Tables"]["event_photos"]["Row"];

export type EventWithPhotos = Event & { photos: Photo[] };
