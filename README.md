# Exa Search React App

A modern React TypeScript application that provides a web interface for Exa Search API, featuring both Neural Search and Find Similar Pages functionality with Google-style pagination.

## Features

- 🔍 **Neural Search**: AI-powered semantic search across the web
- 🔗 **Find Similar Pages**: Discover pages similar to a given URL
- 📱 **Responsive Design**: Built with Tailwind CSS and ShadCN UI
- ⚡ **Fast & Efficient**: Powered by Vite and TanStack Query
- 🎨 **Modern UI**: Clean, accessible interface with dark/light mode support
- 📄 **Google-style Pagination**: Navigate through search results with 10 results per page (3 pages max)
- 💰 **Cost Tracking**: Display API usage costs and response times

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Query** for data fetching and caching
- **ShadCN UI** for beautiful, accessible components
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- An Exa API key (get one at [dashboard.exa.ai](https://dashboard.exa.ai/))

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd exa-search
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Add your Exa API key to the `.env` file:

```
VITE_EXA_API_KEY=your_actual_api_key_here
```

5. Start the development server:

```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Usage

### Neural Search

1. Select the "Neural Search" tab
2. Enter your search query
3. Configure options (include text content)
4. Click "Search" to get AI-powered results
5. Navigate through pages using pagination controls

### Find Similar Pages

1. Select the "Find Similar" tab
2. Enter a URL to find similar pages
3. Click "Find Similar Pages"
4. Navigate through pages using pagination controls

### Pagination

- Results are displayed 10 per page (Google-style)
- The app fetches up to 30 results initially and paginates through them client-side
- Maximum of 3 pages available (30 results total)
- Use the pagination controls to navigate between pages
- Shows current page and total pages available
- Displays total result count and current page results
- Intelligent caching prevents redundant API calls when navigating pages

## API Integration

The app integrates with the Exa API endpoints:

- `/search` - For neural search functionality
- `/findSimilar` - For finding similar pages

All API calls include proper error handling and loading states.

## Deployment

This app supports both local development and production deployment on Netlify with automatic CORS handling.

### Local Development

For local development, the app makes direct API calls to Exa:

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Configure environment variables in `.env.local`:

```
VITE_USE_DIRECT=true
VITE_EXA_API_KEY=your_exa_api_key_here
```

3. Start the development server:

```bash
npm run dev
```

### Netlify Deployment

For production deployment on Netlify, the app uses serverless functions to proxy API calls and avoid CORS issues:

1. **Deploy to Netlify**: Connect your repository to Netlify

2. **Configure Environment Variables** in Netlify Dashboard → Site Settings → Environment Variables:

```
EXA_API_KEY=your_exa_api_key_here
```

3. **Build Settings**: Netlify will automatically detect the build settings from `netlify.toml` (if present) or use:

   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Serverless Functions**: The app includes a Netlify function at `netlify/functions/exa-proxy.js` that handles API proxying

### Environment Configuration

The app automatically detects the environment:

- **Local Development**: When `VITE_USE_DIRECT=true` is set, makes direct API calls
- **Production**: When `VITE_USE_DIRECT` is unset, uses Netlify functions as a proxy

This approach ensures:

- ✅ No CORS issues in production
- ✅ API keys are kept secure on the server
- ✅ Fast development experience locally
- ✅ Seamless deployment to Netlify

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # ShadCN UI components
│   ├── SearchForm.tsx  # Search form component
│   ├── ResultCard.tsx  # Result display component
│   └── Pagination.tsx  # Pagination component
├── lib/                # Utility functions
│   ├── utils.ts        # General utilities
│   └── exa-api.ts      # Exa API integration
├── types/              # TypeScript type definitions
│   └── exa.ts          # Exa API types
└── App.tsx             # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
