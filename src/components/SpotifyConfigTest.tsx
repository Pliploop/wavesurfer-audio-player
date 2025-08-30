import React from 'react';
import { SPOTIFY_CONFIG, isSpotifyConfigured, debugSpotifyConfig } from '../config/spotify';

const SpotifyConfigTest: React.FC = () => {
  const handleTest = () => {
    debugSpotifyConfig();
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-blue-900 mb-2">Spotify Configuration Test</h3>
      <div className="space-y-2 text-xs text-blue-800">
        <div>
          <strong>Client ID:</strong> {SPOTIFY_CONFIG.CLIENT_ID === 'your_spotify_client_id_here' ? '❌ Not configured' : '✅ Configured'}
        </div>
        <div>
          <strong>Client Secret:</strong> {SPOTIFY_CONFIG.CLIENT_SECRET === 'your_spotify_client_secret_here' ? '❌ Not configured' : '✅ Configured'}
        </div>
        <div>
          <strong>Status:</strong> {isSpotifyConfigured() ? '✅ Ready' : '❌ Not ready'}
        </div>
        <div>
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </div>
        <div>
          <strong>REACT_APP_SPOTIFY_CLIENT_ID:</strong> {process.env.REACT_APP_SPOTIFY_CLIENT_ID ? '✅ Set' : '❌ Not set'}
        </div>
        <div>
          <strong>REACT_APP_SPOTIFY_CLIENT_SECRET:</strong> {process.env.REACT_APP_SPOTIFY_CLIENT_SECRET ? '✅ Set' : '❌ Not set'}
        </div>
      </div>
      <button
        onClick={handleTest}
        className="mt-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
      >
        Debug to Console
      </button>
    </div>
  );
};

export default SpotifyConfigTest;
