import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface AudioPlayerProps {}

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
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
        });

        wavesurferRef.current.on('ready', () => {
          console.log('WaveSurfer ready!');
          setDuration(wavesurferRef.current!.getDuration());
          setIsLoading(false);
          setError(null);
        });

        wavesurferRef.current.on('audioprocess', () => {
          setCurrentTime(wavesurferRef.current!.getCurrentTime());
        });

        wavesurferRef.current.on('finish', () => {
          setIsPlaying(false);
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
  }, []); // Only run once on mount

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
        });
      } catch (err) {
        console.error('Error updating waveform options:', err);
      }
    }
  }, [waveformOptions.waveColor, waveformOptions.progressColor, waveformOptions.cursorColor, waveformOptions.barWidth, waveformOptions.barGap, waveformOptions.barRadius, waveformOptions.height, audioFile]);

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
      setError('Please select a valid audio file');
    }
  };

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopAudio = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const seekTo = (time: number) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.seekTo(time / duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
    });
    setVolume(1);
    setPlaybackRate(1);
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
                        className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                        title="Wave Color"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block text-xs text-gray-600 mb-1">Progress</label>
                      <input
                        type="color"
                        value={waveformOptions.progressColor}
                        onChange={(e) => handleOptionChange('progressColor', e.target.value)}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                        title="Progress Color"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block text-xs text-gray-600 mb-1">Cursor</label>
                      <input
                        type="color"
                        value={waveformOptions.cursorColor}
                        onChange={(e) => handleOptionChange('cursorColor', e.target.value)}
                        className="w-12 h-12 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
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
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Audio File
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
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
              </div>

              {audioFile && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-indigo-800">
                      <span className="font-medium">File:</span> {audioFile.name}
                    </p>
                  </div>
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

              {audioFile && (
                <div className="space-y-4">
                  {/* Playback Controls */}
                  <div className="flex items-center justify-center space-x-4">
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

                  {/* Progress Bar */}
                  <div className="w-full">
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={(e) => seekTo(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Volume and Playback Rate */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volume
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Playback Speed
                      </label>
                      <select
                        value={playbackRate}
                        onChange={(e) => setPlaybackRate(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                    </div>
                  </div>
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
