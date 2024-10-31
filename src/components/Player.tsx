import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { usePlayerStore } from '../store';

export default function Player() {
  const { currentSong, isPlaying, volume, togglePlay, setVolume } = usePlayerStore();

  return (
    <div className="h-20 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between">
      {/* Current Song Info */}
      <div className="w-1/3 flex items-center">
        {currentSong && (
          <>
            <img
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="h-14 w-14 rounded"
            />
            <div className="ml-4">
              <div className="text-white text-sm">{currentSong.title}</div>
              <div className="text-gray-400 text-xs">{currentSong.artist}</div>
            </div>
          </>
        )}
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center space-x-6">
          <button className="text-gray-400 hover:text-white">
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="bg-white rounded-full p-2 hover:scale-105 transition"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-black" />
            ) : (
              <Play className="w-5 h-5 text-black" />
            )}
          </button>
          <button className="text-gray-400 hover:text-white">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        <div className="w-full mt-2 flex items-center">
          <span className="text-xs text-gray-400">0:00</span>
          <div className="mx-2 flex-1 h-1 bg-gray-600 rounded-full">
            <div className="w-0 h-full bg-white rounded-full"></div>
          </div>
          <span className="text-xs text-gray-400">0:00</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="w-1/3 flex justify-end items-center">
        <Volume2 className="w-5 h-5 text-gray-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="ml-2 w-24"
        />
      </div>
    </div>
  );
}