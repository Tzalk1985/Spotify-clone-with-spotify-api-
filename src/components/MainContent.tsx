import React, { useEffect, useState } from 'react';
import { Play, Clock } from 'lucide-react';
import { usePlayerStore } from '../store';
import { spotifyAPI } from '../lib/spotify';
import type { Song } from '../types';

function transformTrack(track: any): Song {
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map((a: any) => a.name).join(', '),
    album: track.album.name,
    duration: msToTime(track.duration_ms),
    coverUrl: track.album.images[0]?.url,
    uri: track.uri
  };
}

function msToTime(duration: number): string {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function MainContent() {
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [topTracks, setTopTracks] = useState<Song[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentData, topData] = await Promise.all([
          spotifyAPI.getRecentlyPlayed(),
          spotifyAPI.getTopTracks()
        ]);

        setRecentlyPlayed(recentData.items.map((item: any) => transformTrack(item.track)));
        setTopTracks(topData.items.map(transformTrack));
      } catch (error) {
        console.error('Failed to fetch tracks:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] overflow-auto">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recently Played</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {recentlyPlayed.map((song) => (
            <div
              key={song.id}
              className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors group cursor-pointer"
              onClick={() => setCurrentSong(song)}
            >
              <div className="relative">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-md mb-4"
                />
                <button className="absolute bottom-4 right-4 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105 transform">
                  <Play className="w-6 h-6 text-black" fill="black" />
                </button>
              </div>
              <h3 className="text-white font-semibold mb-1">{song.title}</h3>
              <p className="text-gray-400 text-sm">{song.artist}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Top Songs</h2>
        <div className="bg-[#181818] rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#282828] text-gray-400 text-sm">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Album</th>
                <th className="px-4 py-2"><Clock className="w-4 h-4" /></th>
              </tr>
            </thead>
            <tbody>
              {topTracks.map((song, index) => (
                <tr
                  key={song.id}
                  className="text-gray-300 hover:bg-[#282828] cursor-pointer"
                  onClick={() => setCurrentSong(song)}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-10 h-10 rounded mr-3"
                      />
                      <div>
                        <div className="text-white">{song.title}</div>
                        <div className="text-sm text-gray-400">{song.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{song.album}</td>
                  <td className="px-4 py-2">{song.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}