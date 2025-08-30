import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { SPOTIFY_CONFIG, isSpotifyConfigured, debugSpotifyConfig } from '../config/spotify';
import SpotifyConfigTest from './SpotifyConfigTest';

interface AudioPlayerProps {}

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  preview_url: string;
  external_urls: {
    spotify: string;
  };
}

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);


  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // New state for export
  const [isExporting, setIsExporting] = useState(false);
  
  // New state for Spotify search
  const [spotifyQuery, setSpotifyQuery] = useState('');
  const [spotifyResults, setSpotifyResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  
  const [waveformOptions, setWaveformOptions] = useState({
    waveColor: '#4F46E5',
    progressColor: '#7C3AED',
    cursorColor: '#1F2937',
    barWidth: 2,
    barGap: 1,
    barRadius: 3,
    height: 100,
    normalize: true,
    interact: true,
    fillParent: true,
    autoCenter: true,
    minPxPerSec: 50,
  });

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      try {
        console.log('Creating WaveSurfer instance...');
        console.log('Container dimensions:', {
          width: waveformRef.current.offsetWidth,
          height: waveformRef.current.offsetHeight,
          clientWidth: waveformRef.current.clientWidth,
          clientHeight: waveformRef.current.clientHeight
        });
        
        wavesurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: waveformOptions.waveColor,
          progressColor: waveformOptions.progressColor,
          cursorColor: waveformOptions.cursorColor,
          barWidth: waveformOptions.barWidth,
          barGap: waveformOptions.barGap,
          barRadius: waveformOptions.barRadius,
          height: waveformOptions.height,
          normalize: waveformOptions.normalize,
          interact: waveformOptions.interact,
          fillParent: waveformOptions.fillParent,
          autoCenter: waveformOptions.autoCenter,
          minPxPerSec: waveformOptions.minPxPerSec,
        });

        wavesurferRef.current.on('ready', () => {
          console.log('WaveSurfer ready!');
          setIsLoading(false);
          setError(null);
        });

        wavesurferRef.current.on('audioprocess', () => {
          // Update current time for progress tracking
        });

        wavesurferRef.current.on('finish', () => {
          setIsPlaying(() => false);
        });

        wavesurferRef.current.on('error', (err) => {
          console.error('WaveSurfer error:', err);
          setError('Error loading audio file');
          setIsLoading(false);
        });

        wavesurferRef.current.on('loading', () => {
          console.log('WaveSurfer loading...');
          setIsLoading(true);
          setError(null);
        });

        // Set initial volume
        wavesurferRef.current.setVolume(volume);

        // Add keyboard shortcuts and mouse wheel zoom
        const handleKeyDown = (e: KeyboardEvent) => {
          if (!wavesurferRef.current) return;
          
          switch (e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              wavesurferRef.current.setTime(Math.max(0, wavesurferRef.current.getCurrentTime() - 5));
              break;
            case 'ArrowRight':
              e.preventDefault();
              wavesurferRef.current.setTime(Math.min(wavesurferRef.current.getDuration(), wavesurferRef.current.getCurrentTime() + 5));
              break;
            case ' ':
              e.preventDefault();
              wavesurferRef.current.playPause();
              setIsPlaying(!isPlaying);
              break;
            case 'Home':
              e.preventDefault();
              wavesurferRef.current.setTime(0);
              break;
            case 'End':
              e.preventDefault();
              wavesurferRef.current.setTime(wavesurferRef.current.getDuration());
              break;
          }
        };

        const handleWheel = (e: WheelEvent) => {
          if (!wavesurferRef.current || !e.ctrlKey) return;
          
          e.preventDefault();
          const currentZoom = waveformOptions.minPxPerSec;
          const newZoom = Math.max(10, Math.min(500, currentZoom + (e.deltaY > 0 ? -10 : 10)));
          wavesurferRef.current.zoom(newZoom);
          setWaveformOptions(prev => ({ ...prev, minPxPerSec: newZoom }));
        };

        // Store ref in variable for cleanup
        const currentWaveformRef = waveformRef.current;
        
        // Add event listeners
        document.addEventListener('keydown', handleKeyDown);
        currentWaveformRef.addEventListener('wheel', handleWheel, { passive: false });

        // Cleanup function
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          if (currentWaveformRef) {
            currentWaveformRef.removeEventListener('wheel', handleWheel);
          }
        };
      } catch (err) {
        console.error('WaveSurfer initialization error:', err);
        setError('Failed to initialize waveform');
      }
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]); // Only run once on mount, but include volume dependency

  // Separate effect for updating options without recreating the instance
  useEffect(() => {
    if (wavesurferRef.current && audioFile) {
      try {
        // Only update visual options that don't require recreation
        wavesurferRef.current.setOptions({
          waveColor: waveformOptions.waveColor,
          progressColor: waveformOptions.progressColor,
          cursorColor: waveformOptions.cursorColor,
          barWidth: waveformOptions.barWidth,
          barGap: waveformOptions.barGap,
          barRadius: waveformOptions.barRadius,
          height: waveformOptions.height,
          minPxPerSec: waveformOptions.minPxPerSec,
        });
      } catch (err) {
        console.error('Error updating waveform options:', err);
      }
    }
  }, [waveformOptions, audioFile]);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(playbackRate);
    }
  }, [playbackRate]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setError(null);
      setIsLoading(true);
      const audioUrl = URL.createObjectURL(file);
      if (wavesurferRef.current) {
        wavesurferRef.current.load(audioUrl);
      }
    } else if (file) {
      setError('Invalid file type');
    }
  };

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(prev => !prev);
    }
  };

  const stopAudio = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
      setIsPlaying(false);
      // Reset current time
    }
  };





  const handleOptionChange = (key: string, value: string | number | boolean) => {
    setWaveformOptions(prev => ({
      ...prev,
      [key]: typeof value === 'boolean' ? value : 
        (key === 'height' || key === 'barWidth' || key === 'barGap' || key === 'barRadius') 
          ? Number(value) 
          : value
    }));
  };

  const resetToDefaults = () => {
    setWaveformOptions({
      waveColor: '#4F46E5',
      progressColor: '#7C3AED',
      cursorColor: '#1F2937',
      barWidth: 2,
      barGap: 1,
      barRadius: 3,
      height: 100,
      normalize: true,
      interact: true,
      fillParent: true,
      autoCenter: true,
      minPxPerSec: 50,
    });
    setVolume(1);
    setPlaybackRate(1);
  };

  // Export waveform functions
  const exportWaveform = async (format: 'png' | 'svg') => {
    if (!wavesurferRef.current) return;
    
    setIsExporting(true);
    try {
      if (format === 'png') {
        const dataUrls = await wavesurferRef.current.exportImage('image/png', 0.9, 'dataURL');
        if (dataUrls && dataUrls.length > 0) {
          const link = document.createElement('a');
          link.download = `waveform-${Date.now()}.png`;
          link.href = dataUrls[0];
          link.click();
        }
      } else if (format === 'svg') {
        // For SVG export, we'll create a simple SVG representation
        const svgContent = createSVGExport();
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `waveform-${Date.now()}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export error:', err);
      setError('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const createSVGExport = () => {
    // Create a simple SVG representation of the waveform
    const width = waveformRef.current?.offsetWidth || 800;
    const height = waveformOptions.height;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="white"/>
  <text x="10" y="20" font-family="Arial" font-size="14" fill="${waveformOptions.waveColor}">
    WaveSurfer.js Waveform Export
  </text>
  <text x="10" y="40" font-family="Arial" font-size="12" fill="${waveformOptions.progressColor}">
    Generated on ${new Date().toLocaleString()}
  </text>
</svg>`;
  };



  // Spotify search functions
  const searchSpotify = async (query: string) => {
    if (!query.trim()) {
      setSpotifyResults([]);
      return;
    }

    // Debug: Log configuration info (remove in production)
    debugSpotifyConfig();

    setIsSearching(true);
    try {
      // Check if Spotify is properly configured
      if (!isSpotifyConfigured()) {
        throw new Error('Credentials needed');
      }

      // Spotify API integration using environment variables
      const CLIENT_ID = SPOTIFY_CONFIG.CLIENT_ID;
      const CLIENT_SECRET = SPOTIFY_CONFIG.CLIENT_SECRET;
      
      // Get access token using client credentials flow
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
      });

      if (!tokenResponse.ok) {
        throw new Error('Token error');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Search for tracks
      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!searchResponse.ok) {
        throw new Error('Search error');
      }

      const searchData = await searchResponse.json();
      const tracks: SpotifyTrack[] = searchData.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        preview_url: track.preview_url,
        external_urls: track.external_urls
      }));

      setSpotifyResults(tracks);
    } catch (err) {
      console.error('Spotify search error:', err);
      // Fallback to mock results if API fails
      const mockResults: SpotifyTrack[] = [
        {
          id: '1',
          name: 'Bohemian Rhapsody',
          artist: 'Queen',
          album: 'A Night at the Opera',
          preview_url: 'https://example.com/preview1.mp3',
          external_urls: { spotify: 'https://open.spotify.com/track/1' }
        },
        {
          id: '2',
          name: 'Hotel California',
          artist: 'Eagles',
          album: 'Hotel California',
          preview_url: 'https://example.com/preview2.mp3',
          external_urls: { spotify: 'https://open.spotify.com/track/2' }
        },
        {
          id: '3',
          name: 'Stairway to Heaven',
          artist: 'Led Zeppelin',
          album: 'Led Zeppelin IV',
          preview_url: 'https://example.com/preview3.mp3',
          external_urls: { spotify: 'https://open.spotify.com/track/3' }
        }
      ].filter(track => 
        track.name.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase())
      );
      
      setSpotifyResults(mockResults);
      setError('Showing sample results');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSpotifySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSpotifyQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchSpotify(query);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  const selectSpotifyTrack = (track: SpotifyTrack) => {
    setSpotifyQuery(`${track.name} - ${track.artist}`);
    setSpotifyResults([]);
    
    if (track.preview_url) {
      // Load the Spotify preview URL into WaveSurfer
      setError(null);
      setIsLoading(true);
      
      if (wavesurferRef.current) {
        try {
          wavesurferRef.current.load(track.preview_url);
          setAudioFile(new File([], `${track.name} - ${track.artist} (Spotify Preview)`));
        } catch (err) {
          console.error('Error loading Spotify preview:', err);
          setError('Loading preview...');
        }
      }
    } else {
      // No preview URL available - just show in info box
      setError('No preview available for this track');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Audio Waveform Player
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload audio files and customize the waveform visualization with real-time preview
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.586 10l-1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Parameter Controls */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-xl p-5 border border-gray-100 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Waveform Controls
                </h2>
                <button
                  onClick={resetToDefaults}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Reset
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Colors - Side by side in circles */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-1">Colors</h3>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <label className="block text-xs text-gray-600 mb-1">Wave</label>
                      <input
                        type="color"
                        value={waveformOptions.waveColor}
                        onChange={(e) => handleOptionChange('waveColor', e.target.value)}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors [&::-webkit-color-swatch-wrapper]:rounded-full [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:rounded-full"
                        title="Wave Color"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block text-xs text-gray-600 mb-1">Progress</label>
                      <input
                        type="color"
                        value={waveformOptions.progressColor}
                        onChange={(e) => handleOptionChange('progressColor', e.target.value)}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors [&::-webkit-color-swatch-wrapper]:rounded-full [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:rounded-full"
                        title="Progress Color"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block text-xs text-gray-600 mb-1">Cursor</label>
                      <input
                        type="color"
                        value={waveformOptions.cursorColor}
                        onChange={(e) => handleOptionChange('cursorColor', e.target.value)}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors [&::-webkit-color-swatch-wrapper]:rounded-full [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:rounded-full"
                        title="Cursor Color"
                      />
                    </div>
                  </div>
                </div>

                {/* Dimensions - More compact */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-1">Dimensions</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-600">Bar Width</label>
                        <span className="text-xs text-gray-500">{waveformOptions.barWidth}px</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={waveformOptions.barWidth}
                        onChange={(e) => handleOptionChange('barWidth', e.target.value)}
                        className="w-full h-1.5"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-600">Bar Gap</label>
                        <span className="text-xs text-gray-500">{waveformOptions.barGap}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={waveformOptions.barGap}
                        onChange={(e) => handleOptionChange('barGap', e.target.value)}
                        className="w-full h-1.5"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-600">Height</label>
                        <span className="text-xs text-gray-500">{waveformOptions.height}px</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={waveformOptions.height}
                        onChange={(e) => handleOptionChange('height', e.target.value)}
                        className="w-full h-1.5"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-600">Bar Radius</label>
                        <span className="text-xs text-gray-500">{waveformOptions.barRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={waveformOptions.barRadius}
                        onChange={(e) => handleOptionChange('barRadius', e.target.value)}
                        className="w-full h-1.5"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-gray-600">Zoom Level</label>
                        <span className="text-xs text-gray-500">{waveformOptions.minPxPerSec}px/s</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={waveformOptions.minPxPerSec}
                        onChange={(e) => handleOptionChange('minPxPerSec', e.target.value)}
                        className="w-full h-1.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Behavior - Compact checkboxes */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-1">Behavior</h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={waveformOptions.normalize}
                        onChange={(e) => handleOptionChange('normalize', e.target.checked)}
                        className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="text-xs text-gray-700">Normalize</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={waveformOptions.interact}
                        onChange={(e) => handleOptionChange('interact', e.target.checked)}
                        className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="text-xs text-gray-700">Interactive</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={waveformOptions.fillParent}
                        onChange={(e) => handleOptionChange('fillParent', e.target.checked)}
                        className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="text-xs text-gray-700">Fill Parent</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={waveformOptions.autoCenter}
                        onChange={(e) => handleOptionChange('autoCenter', e.target.checked)}
                        className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="text-xs text-gray-700">Auto Center</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Main Audio Player */}
          <div className="lg:flex-1 lg:min-w-0">
            <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
              {/* Audio Input Options - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* File Upload Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Upload Audio File</h3>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-6 h-6 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">MP3, WAV, OGG, or any audio format</p>
                      </div>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {audioFile && (
                    <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm text-indigo-800">
                            <span className="font-medium">File:</span> {audioFile.name}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setAudioFile(null);
                            if (wavesurferRef.current) {
                              wavesurferRef.current.empty();
                            }
                            setError(null);
                            setIsPlaying(false);
                          }}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                          title="Remove audio file"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Spotify Search Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Search Spotify</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Search for songs and click on results to load 30-second previews
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      value={spotifyQuery}
                      onChange={handleSpotifySearch}
                      placeholder="Search for songs, artists, or albums..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Spotify Search Results */}
                  {spotifyResults.length > 0 && (
                    <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {spotifyResults.map((track) => (
                        <div
                          key={track.id}
                          onClick={() => selectSpotifyTrack(track)}
                          className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{track.name}</p>
                              <p className="text-xs text-gray-600">{track.artist}</p>
                              {track.preview_url && (
                                <p className="text-xs text-green-600">🎵 Preview available</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {track.preview_url ? (
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L10.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.586 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Spotify Configuration Test */}
              <SpotifyConfigTest />

              {/* Global Audio Reset Button */}
              {(audioFile || spotifyQuery) && (
                <div className="mb-6 flex justify-center">
                  <button
                    onClick={() => {
                      setAudioFile(null);
                      setSpotifyQuery('');
                      setSpotifyResults([]);
                      if (wavesurferRef.current) {
                        wavesurferRef.current.empty();
                      }
                      setError(null);
                      setIsPlaying(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    title="Clear all audio and reset player"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 11 2 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Clear All Audio</span>
                  </button>
                </div>
              )}

              <div className="mb-6 relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                )}
                <div 
                  ref={waveformRef} 
                  className="w-full bg-white rounded-lg border border-gray-200"
                  style={{ 
                    height: `${Math.max(120, waveformOptions.height)}px`,
                    minHeight: '120px',
                    position: 'relative'
                  }}
                />
                {!audioFile && !isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">Upload an audio file to see the waveform</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Export and Navigation Controls */}
              {audioFile && (
                <div className="mb-6 space-y-4">
                  {/* Export Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => exportWaveform('png')}
                        disabled={isExporting}
                        className="export-btn flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Export as PNG"
                      >
                        {isExporting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        ) : (
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                        PNG
                      </button>
                      <button
                        onClick={() => exportWaveform('svg')}
                        disabled={isExporting}
                        className="export-btn flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Export as SVG"
                      >
                        {isExporting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        ) : (
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                        SVG
                      </button>
                    </div>
                    
                    {/* Navigation Info */}
                    <div className="text-xs text-gray-500">
                      <span className="hidden sm:inline">Ctrl+Scroll to zoom • </span>
                      <span className="hidden sm:inline">←→ to seek • </span>
                      <span className="hidden sm:inline">Space to play/pause</span>
                    </div>
                  </div>


                </div>
              )}

              {/* Audio Controls - Right under the waveform */}
              {audioFile && (
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <button
                    onClick={stopAudio}
                    className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    title="Stop"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
