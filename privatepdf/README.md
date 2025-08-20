# PrivatePDF

A privacy-first PDF editor that runs entirely in your browser. No file uploads, no server processing - everything happens locally on your device.

## Features

- **Client-side only**: All PDF processing happens in your browser
- **Form filling**: Fill and edit AcroForms with automatic appearance updates
- **Overlay editing**: Add text, shapes, highlights, arrows, and freehand drawings
- **Page management**: Rotate, reorder, delete, and insert pages
- **Offline-first**: Works offline after initial load
- **PWA support**: Install as a desktop app
- **Privacy focused**: No data leaves your device

## Tech Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **PDF Viewing**: pdf.js (Mozilla)
- **PDF Editing**: pdf-lib
- **State Management**: Zustand
- **PWA**: Service Worker + Web Manifest

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd privatepdf
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Usage

### Opening PDFs

- Drag and drop PDF files onto the drop zone
- Click the drop zone to browse and select files
- Use the "Open" button in the toolbar

### Editing Tools

- **Select (V)**: Select and move overlays
- **Text (T)**: Add text annotations
- **Rectangle (R)**: Draw rectangles and squares
- **Highlight (H)**: Create highlight overlays
- **Arrow (A)**: Draw arrows
- **Pen (P)**: Freehand drawing
- **Image (I)**: Insert images

### Form Filling

- Forms are automatically detected when opening PDFs
- Click on form fields to edit them
- Use the Forms panel to see all available fields
- Choose whether to flatten forms when saving

### Saving

- **Save with Editable Forms**: Preserves form fields for future editing
- **Save Flattened**: Bakes all overlays and flattens forms permanently

## Development

### Project Structure

```
src/
├── components/          # React components
├── modules/            # Feature modules
│   ├── fileio/        # File operations
│   ├── viewer/        # PDF viewing (pdf.js)
│   ├── editor/        # Overlay editing
│   ├── forms/         # Form handling
│   ├── pages/         # Page management
│   ├── pwa/           # PWA functionality
│   ├── state/         # State management
│   └── utils/         # Utility functions
├── types/              # TypeScript type definitions
└── styles/             # CSS and styling
```

### Key Components

- **AppShell**: Main application layout
- **Toolbar**: File operations and tool selection
- **Sidebar**: Page thumbnails and panels
- **PdfViewer**: PDF rendering and interaction
- **PropertiesPanel**: Overlay property editing

### State Management

The application uses Zustand for state management with the following main stores:

- **Document State**: PDF content, pages, forms, overlays
- **Tool State**: Active tools and drawing state
- **UI State**: Interface layout and preferences
- **PWA State**: Service worker and installation status

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## Privacy & Security

- **No file uploads**: All processing happens locally
- **No analytics**: No tracking or data collection
- **Offline capable**: Works without internet connection
- **Local storage**: Recent files stored in browser storage only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [pdf.js](https://mozilla.github.io/pdf.js/) - PDF viewing library
- [pdf-lib](https://pdf-lib.js.org/) - PDF creation and manipulation
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons

## Roadmap

### v1.0 (Current)
- Basic PDF viewing and form filling
- Overlay editing tools
- Page management
- PWA support

### Future Versions
- Text search and highlighting
- PDF optimization and compression
- Digital signatures
- Advanced redaction tools
- Collaborative editing
- Cloud storage integration (optional)
