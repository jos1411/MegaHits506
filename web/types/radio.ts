export interface NowPlaying {
  artist: string;
  title: string;
  album: string | null;
  art: string | null;
}

export interface RadioStatus {
  online: boolean;
  listeners: number;
  nowPlaying: NowPlaying | null;
}
