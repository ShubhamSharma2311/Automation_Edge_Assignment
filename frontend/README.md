# Frontend - AI Code Generation Copilot

React + TypeScript frontend application for AI-powered code generation.

## 🚀 Features

- 🔐 User authentication (Login/Signup)
- 🤖 AI code generation with multiple language support
- 🎨 Syntax highlighting with VS Code Dark Plus theme
- 📊 Generation history with language filtering
- 📋 Copy to clipboard functionality
- 📱 Responsive design with TailwindCSS
- ⚡ Request deduplication to prevent duplicate API calls

## 📋 Prerequisites

- Node.js v16 or higher
- Backend server running (see backend README)

## 🛠️ Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start development server**
```bash
npm run dev
```

Application runs at: `http://localhost:5173`

## 🏗️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Syntax Highlighter** - Code display with syntax highlighting

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx    # Route guard
│   ├── contexts/
│   │   └── AuthContext.tsx       # Global auth state
│   ├── hooks/
│   │   └── useAuth.ts            # Auth hook
│   ├── pages/
│   │   ├── Login.tsx             # Login page
│   │   ├── Signup.tsx            # Registration page
│   │   ├── Generate.tsx          # Code generation page
│   │   └── History.tsx           # History with filtering
│   ├── services/
│   │   ├── api.ts                # Axios instance
│   │   ├── auth.service.ts       # Auth API calls
│   │   └── generation.service.ts # Generation API calls
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
├── .env.example                  # Environment template
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript config
└── vite.config.ts                # Vite config
```

## 🎨 Key Features Implementation

### 1. Authentication Flow
- Context API for global auth state
- Protected routes with automatic redirect
- JWT stored in HTTP-only cookies (secure)
- Persistent login across page refreshes

### 2. Code Generation
- Language selector with 8+ languages
- Real-time syntax highlighting
- Copy to clipboard with one click
- Request deduplication to save API quota

### 3. History Management
- Pagination (5 items per page)
- Filter by programming language
- Displays prompt, code, and timestamp
- Same syntax highlighting as generation page

## 🔧 Available Scripts

```bash
npm run dev       # Start development server (with HMR)
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## 🌐 Environment Variables

```env
VITE_API_URL=http://localhost:5000/api    # Backend API base URL
```

**Note:** For production, update `VITE_API_URL` to your deployed backend URL.

## 📦 Dependencies

**Core:**
- react v18.3.1
- react-dom v18.3.1
- react-router-dom v7.1.1

**Utilities:**
- axios v1.7.9
- react-syntax-highlighter v15.6.1

**Styling:**
- tailwindcss v3.4.17

**Development:**
- vite v6.0.3
- typescript v5.6.3
- @vitejs/plugin-react v4.3.4

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your deployed backend URL
5. Deploy

### Netlify

1. Push code to GitHub
2. Import project in Netlify
3. Set build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your deployed backend URL
5. Deploy

## 🐛 Troubleshooting

### API Connection Error
- Ensure backend is running
- Check `VITE_API_URL` in `.env`
- Verify CORS is enabled in backend

### Authentication Issues
- Clear browser cookies
- Check if backend JWT_SECRET is set
- Verify cookies are being sent (Network tab)

### Build Errors
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📸 Screenshots

See `/docs` folder in root directory for application screenshots.

## 📝 License

MIT License
