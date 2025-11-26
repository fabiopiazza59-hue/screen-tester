# Echo Show Screen Tester

A React-based tool for testing how images and videos appear across different Amazon Echo Show device screen sizes simultaneously.

![Echo Show Screen Tester](https://img.shields.io/badge/React-19.2.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38bdf8) ![Vite](https://img.shields.io/badge/Vite-7.2.5-646cff)

## Features

- **Multi-Device Preview**: Test content on 6 different Echo Show models simultaneously
- **Drag & Drop Upload**: Easy image and video upload via drag-and-drop or file picker
- **Device Selection**: Choose which devices to preview with an intuitive dropdown
- **View Modes**: Switch between grid and stacked layouts
- **Adjustable Scale**: Scale previews from 15% to 100% to fit your screen
- **Video Controls**: Play, pause, and restart videos across all devices at once
- **Accurate Resolutions**: Uses real Echo Show screen specifications

## Supported Devices

| Device | Screen Size | Resolution | Year |
|--------|-------------|------------|------|
| Echo Show 5 | 5.5" | 960×480 | 2023 |
| Echo Show 8 | 8" | 1280×800 | 2023 |
| Echo Show 8 | 8.7" | 1280×800 | 2025 |
| Echo Show 10 | 10.1" | 1280×800 | 2023 |
| Echo Show 15 | 15.6" | 1920×1080 | 2024 |
| Echo Show 21 | 21" | 1920×1080 | 2024 |

## Installation

```bash
# Clone the repository
git clone https://github.com/fabiopiazza59-hue/screen-tester.git

# Navigate to the project directory
cd screen-tester

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Usage

1. **Upload Media**: Click the upload area or drag and drop an image or video file
2. **Select Devices**: Choose which Echo Show devices you want to preview
3. **Adjust View**: Switch between grid/stack view and adjust the scale slider
4. **Control Playback**: For videos, use the play/pause and restart controls

## Tech Stack

- **React 19.2.0**: UI framework
- **Vite 7.2.5**: Build tool and dev server
- **Tailwind CSS 4.1.17**: Styling
- **Lucide React**: Icons
- **PostCSS**: CSS processing

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## License

MIT

## Author

Fabio Piazza
