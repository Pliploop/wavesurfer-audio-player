// Spotify API Configuration
// Get your credentials from: https://developer.spotify.com/dashboard
// 
// Setup Instructions:
// 1. Create a .env file in the root directory
// 2. Add your credentials:
//    REACT_APP_SPOTIFY_CLIENT_ID=your_actual_client_id
//    REACT_APP_SPOTIFY_CLIENT_SECRET=your_actual_client_secret
// 3. Restart your development server
//
// Note: .env files are automatically ignored by git for security

export const SPOTIFY_CONFIG = {
  CLIENT_ID: process.env.REACT_APP_SPOTIFY_CLIENT_ID || 'your_spotify_client_id_here',
  CLIENT_SECRET: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET || 'your_spotify_client_secret_here',
};

// Check if credentials are properly configured
export const isSpotifyConfigured = () => {
  return SPOTIFY_CONFIG.CLIENT_ID !== 'your_spotify_client_id_here' && 
         SPOTIFY_CONFIG.CLIENT_SECRET !== 'your_spotify_client_secret_here';
};

// Debug function to check environment variables (remove in production)
export const debugSpotifyConfig = () => {
  console.log('Spotify Config Debug Info:');
  console.log('REACT_APP_SPOTIFY_CLIENT_ID:', process.env.REACT_APP_SPOTIFY_CLIENT_ID);
  console.log('REACT_APP_SPOTIFY_CLIENT_SECRET:', process.env.REACT_APP_SPOTIFY_CLIENT_SECRET ? '[HIDDEN]' : 'undefined');
  console.log('SPOTIFY_CONFIG.CLIENT_ID:', SPOTIFY_CONFIG.CLIENT_ID);
  console.log('SPOTIFY_CONFIG.CLIENT_SECRET:', SPOTIFY_CONFIG.CLIENT_SECRET ? '[HIDDEN]' : 'undefined');
  console.log('isSpotifyConfigured():', isSpotifyConfigured());
};
