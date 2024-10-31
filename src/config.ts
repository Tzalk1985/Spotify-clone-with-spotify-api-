export const SPOTIFY_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID || '',
  REDIRECT_URI: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || '',
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-recently-played',
    'playlist-read-private',
    'playlist-read-collaborative'
  ].join(' ')
};