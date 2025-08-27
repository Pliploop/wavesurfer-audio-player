import React from 'react';
import AudioPlayer from './components/AudioPlayer';

function App() {
  return (
    <div className="App min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">WaveSurfer Audio Player</h1>
                <p className="text-sm text-gray-500">Professional Audio Visualization</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                About
              </a>
              <a href="https://github.com/wavesurfer-js/wavesurfer.js" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                WaveSurfer.js
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <AudioPlayer />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Features
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">Audio file upload & playback</li>
                <li className="text-sm text-gray-600">Real-time waveform visualization</li>
                <li className="text-sm text-gray-600">Customizable appearance</li>
                <li className="text-sm text-gray-600">Volume & playback speed control</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Technologies
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">React 19 + TypeScript</li>
                <li className="text-sm text-gray-600">WaveSurfer.js 7</li>
                <li className="text-sm text-gray-600">Tailwind CSS 4</li>
                <li className="text-sm text-gray-600">Modern Web APIs</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://wavesurfer-js.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                    WaveSurfer.js Documentation
                  </a>
                </li>
                <li>
                  <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                    React Documentation
                  </a>
                </li>
                <li>
                  <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                    Tailwind CSS
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-400 text-center">
              Built with ❤️ using modern web technologies. Open source and free to use.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
