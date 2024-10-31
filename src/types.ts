export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  uri?: string;
}

export interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  songs: Song[];
}