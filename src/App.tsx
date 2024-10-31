import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Player from './components/Player';
import LoginButton from './components/LoginButton';
import { usePlayerStore } from './store';
import { spotifyAPI } from './lib/spotify';

function App() {
  const { isAuthenticated, setIsAuthenticated, setUser } = usePlayerStore();

  useEffect(() => {
    const handleAuth = async () => {
      if (spotifyAPI.handleRedirect()) {
        setIsAuthenticated(true);
        try {
          const user = await spotifyAPI.getCurrentUser();
          setUser(user);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          setIsAuthenticated(false);
        }
      }
    };

    handleAuth();
  }, [setIsAuthenticated, setUser]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8">Spotify Clone</h1>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
      <Player />
    </div>
  );
}

export default App;