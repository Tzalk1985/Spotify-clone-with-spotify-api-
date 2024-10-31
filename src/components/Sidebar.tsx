import React from 'react';
import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-black h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-white text-2xl font-bold mb-8">Spotify</h1>
        <nav className="space-y-4">
          <a href="#" className="flex items-center text-gray-300 hover:text-white">
            <Home className="w-6 h-6 mr-4" />
            Home
          </a>
          <a href="#" className="flex items-center text-gray-300 hover:text-white">
            <Search className="w-6 h-6 mr-4" />
            Search
          </a>
          <a href="#" className="flex items-center text-gray-300 hover:text-white">
            <Library className="w-6 h-6 mr-4" />
            Your Library
          </a>
        </nav>
      </div>
      
      <div className="mt-8 p-6">
        <div className="space-y-4">
          <a href="#" className="flex items-center text-gray-300 hover:text-white">
            <PlusSquare className="w-6 h-6 mr-4" />
            Create Playlist
          </a>
          <a href="#" className="flex items-center text-gray-300 hover:text-white">
            <Heart className="w-6 h-6 mr-4" />
            Liked Songs
          </a>
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="text-sm text-gray-400">Your Playlists</div>
          <div className="mt-4 space-y-2">
            {['Chill Vibes', 'Workout Mix', 'Study Session'].map((playlist) => (
              <div key={playlist} className="text-gray-300 hover:text-white cursor-pointer">
                {playlist}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}