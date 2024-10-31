import React from 'react';
import { usePlayerStore } from '../store';

export default function LoginButton() {
  const login = usePlayerStore((state) => state.login);

  return (
    <button
      onClick={login}
      className="bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-8 rounded-full transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
    >
      Connect with Spotify
    </button>
  );
}