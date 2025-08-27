# WaveSurfer Audio Player

A modern, feature-rich audio player built with React, TypeScript, and WaveSurfer.js that provides real-time waveform visualization with extensive customization options.

## ✨ Features

- **Audio Playback**: Upload and play various audio formats (MP3, WAV, OGG, etc.)
- **Real-time Visualization**: Beautiful waveform display using WaveSurfer.js 7
- **Customizable Interface**: Modify colors, dimensions, and behavior in real-time
- **Advanced Controls**: Volume control, playback speed, seek functionality
- **Responsive Design**: Modern UI built with Tailwind CSS 4
- **TypeScript**: Full type safety and modern development experience
- **Error Handling**: Robust error handling and loading states

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wavesurfer-audio-player
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Live Demo

**Live Demo**: [https://juj.github.io/wavesurfer-audio-player](https://juj.github.io/wavesurfer-audio-player)

## 🚀 Deployment

### GitHub Pages (Automatic)

This project is configured for automatic deployment to GitHub Pages:

1. **Push to main branch** - Automatically triggers deployment
2. **Manual deployment** - Run `npm run deploy` locally
3. **GitHub Actions** - Handles build and deployment automatically

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Other Platforms

#### Netlify
1. Build: `npm run build`
2. Deploy the `build` folder to Netlify

#### Vercel
1. Build: `npm run build`
2. Deploy the `build` folder to Vercel

## 🎵 Usage

### Basic Audio Playback

1. **Upload Audio**: Click the upload area or drag & drop an audio file
2. **Play/Pause**: Use the play/pause button to control playback
3. **Stop**: Use the stop button to reset to the beginning
4. **Seek**: Click anywhere on the waveform or use the progress slider
5. **Volume**: Adjust volume using the volume slider
6. **Speed**: Change playback speed from 0.5x to 2x

### Waveform Customization

The app provides extensive customization options organized into three categories:

#### 🎨 Colors
- **Wave Color**: Main waveform color
- **Progress Color**: Playback progress indicator
- **Cursor Color**: Playback cursor

#### 📏 Dimensions
- **Bar Width**: Width of individual waveform bars (1-10px)
- **Bar Gap**: Space between bars (0-5px)
- **Height**: Overall waveform height (50-200px)
- **Bar Radius**: Corner radius of bars (0-10px)

#### ⚙️ Behavior
- **Normalize**: Normalize audio levels
- **Interactive**: Enable click-to-seek functionality
- **Responsive**: Auto-resize with container
- **Fill Parent**: Fill available container width
- **Auto Center**: Center waveform in container

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Audio Visualization**: WaveSurfer.js 7
- **Styling**: Tailwind CSS 4
- **Build Tool**: Create React App
- **Package Manager**: npm
- **Deployment**: GitHub Pages + GitHub Actions

## 📁 Project Structure

```
src/
├── components/
│   └── AudioPlayer.tsx    # Main audio player component
├── App.tsx                # Main app component with header/footer
├── index.tsx              # App entry point
├── index.css              # Global styles and custom CSS
└── ...
.github/
└── workflows/
    └── deploy.yml         # GitHub Actions deployment workflow
```

## 🔧 Customization

### Adding New Waveform Options

To add new customization options, modify the `waveformOptions` state in `AudioPlayer.tsx`:

```typescript
const [waveformOptions, setWaveformOptions] = useState({
  // ... existing options
  newOption: defaultValue,
});
```

### Styling

The app uses Tailwind CSS with custom CSS for enhanced styling. Custom styles are defined in `src/index.css`:

- Custom slider styling
- Smooth transitions
- Custom scrollbars
- Focus states

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [WaveSurfer.js](https://wavesurfer-js.org/) - Audio visualization library
- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [WaveSurfer.js documentation](https://wavesurfer-js.org/)
2. Review the [React documentation](https://react.dev/)
3. Open an issue in this repository

---

Built with ❤️ using modern web technologies
