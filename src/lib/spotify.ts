import { SPOTIFY_CONFIG } from '../config';

export interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  timestamp: number;
}

class SpotifyAPI {
  private token: SpotifyToken | null = null;

  constructor() {
    const savedToken = localStorage.getItem('spotify_token');
    if (savedToken) {
      this.token = JSON.parse(savedToken);
    }
  }

  private saveToken(token: SpotifyToken) {
    this.token = token;
    localStorage.setItem('spotify_token', JSON.stringify(token));
  }

  private isTokenExpired(): boolean {
    if (!this.token) return true;
    const now = Date.now();
    const expirationTime = this.token.timestamp + (this.token.expires_in * 1000);
    return now > expirationTime;
  }

  getLoginUrl(): string {
    if (!SPOTIFY_CONFIG.CLIENT_ID) {
      console.error('Missing Spotify Client ID');
      return '#';
    }

    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('spotify_auth_state', state);

    const params = new URLSearchParams({
      client_id: SPOTIFY_CONFIG.CLIENT_ID,
      response_type: 'token',
      redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
      scope: SPOTIFY_CONFIG.SCOPES,
      state: state,
      show_dialog: 'true'
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  handleRedirect(): boolean {
    if (!window.location.hash) return false;

    try {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      const accessToken = params.get('access_token');
      const tokenType = params.get('token_type');
      const expiresIn = params.get('expires_in');
      const state = params.get('state');
      
      const storedState = localStorage.getItem('spotify_auth_state');
      
      if (!state || state !== storedState) {
        console.error('State mismatch');
        return false;
      }

      localStorage.removeItem('spotify_auth_state');

      if (accessToken && tokenType && expiresIn) {
        this.saveToken({
          access_token: accessToken,
          token_type: tokenType,
          expires_in: parseInt(expiresIn),
          timestamp: Date.now()
        });
        window.location.hash = '';
        return true;
      }
    } catch (error) {
      console.error('Error handling redirect:', error);
    }
    return false;
  }

  async fetchWithToken(endpoint: string, options: RequestInit = {}) {
    if (this.isTokenExpired()) {
      throw new Error('Token expired');
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${this.token?.access_token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('spotify_token');
          window.location.reload();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Spotify API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    return this.fetchWithToken('/me');
  }

  async getRecentlyPlayed() {
    return this.fetchWithToken('/me/player/recently-played?limit=6');
  }

  async getTopTracks() {
    return this.fetchWithToken('/me/top/tracks?limit=20');
  }

  async getPlaylists() {
    return this.fetchWithToken('/me/playlists');
  }

  async play(uri?: string) {
    return this.fetchWithToken('/me/player/play', {
      method: 'PUT',
      body: uri ? JSON.stringify({ uris: [uri] }) : undefined
    });
  }

  async pause() {
    return this.fetchWithToken('/me/player/pause', { method: 'PUT' });
  }
}

export const spotifyAPI = new SpotifyAPI();