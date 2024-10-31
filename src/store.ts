import { create } from 'zustand';
import { Song } from './types';
import { spotifyAPI } from './lib/spotify';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  isAuthenticated: boolean;
  user: any | null;
  setCurrentSong: (song: Song) => void;
  togglePlay: () => Promise<void>;
  setVolume: (volume: number) => void;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: any) => void;
  login: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 1,
  isAuthenticated: false,
  user: null,
  setCurrentSong: async (song) => {
    set({ currentSong: song });
    if (song.uri) {
      await spotifyAPI.play(song.uri);
      set({ isPlaying: true });
    }
  },
  togglePlay: async () => {
    const { isPlaying, currentSong } = get();
    if (!currentSong) return;

    if (isPlaying) {
      await spotifyAPI.pause();
    } else {
      await spotifyAPI.play(currentSong.uri);
    }
    set({ isPlaying: !isPlaying });
  },
  setVolume: (volume) => set({ volume }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  login: () => {
    window.location.href = spotifyAPI.getLoginUrl();
  }
}));