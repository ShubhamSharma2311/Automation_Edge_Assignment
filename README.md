# AI Code Generation Copilot

A full-stack web application that leverages Google's Gemini AI to generate code in multiple programming languages based on natural language prompts. The application features user authentication, code generation history, and syntax highlighting.

## Live Demo

**Deployment URL:** [Add your deployment link here]

**Video Demo:** [Add your 2-3 min video link here]

**Demo Credentials:**
- Email: demo@example.com
- Password: demo123

---

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite (Build tool)
- TailwindCSS (Styling)
- React Router (Routing)
- Axios (HTTP client)
- React Syntax Highlighter (Code display)

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL (Database)
- Prisma ORM
- Google Gemini AI
- JWT (Authentication)
- Zod (Validation)
- Swagger UI (API documentation)

---

## Project Structure

### Backend Structure

```
backend/
├── prisma/
│   ├── migrations/           # Database migration files
│   ├── schema.prisma         # Database schema
│   └── seed.ts              # Database seed script
├── src/
│   ├── config/
│   │   ├── database.ts      # Prisma client setup
│   │   ├── env.ts           # Environment configuration
│   │   ├── gemini.ts        # Gemini AI setup
│   │   └── swagger.ts       # Swagger documentation
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── generation.controller.ts
│   │   └── language.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── generation.routes.ts
│   │   ├── language.routes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── gemini.service.ts
│   │   ├── generation.service.ts
│   │   └── language.service.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── auth.ts
│   │   └── validation.ts
│   └── index.ts             # Entry point
├── .env.example
├── package.json
└── tsconfig.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Generate.tsx
│   │   └── History.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   └── generation.service.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Backend Setup

### Prerequisites
- Node.js v16 or higher
- PostgreSQL v12 or higher
- Google Gemini API Key

### Installation Steps

1. Navigate to backend directory
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/code_copilot
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

4. Setup database
```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

5. Start the server
```bash
npm run dev
```

Server will run at: `http://localhost:5000`

---

## API Documentation

Complete API documentation is available via Swagger UI.

**Swagger UI URL:** [Add your deployment URL]/api-docs

Local development: `http://localhost:5000/api-docs`

![Swagger API Documentation](./frontend/images/swagger-api.png)

---

## Database

### Database: PostgreSQL

The application uses PostgreSQL as the relational database with Prisma ORM for type-safe database access.

### Database Models

**1. users**
- id (Primary Key)
- email (Unique)
- password (Hashed)
- name
- createdAt
- updatedAt

**2. languages**
- id (Primary Key)
- name (Unique)
- slug (Unique)
- createdAt

**3. generations**
- id (Primary Key)
- prompt (Text)
- code (Text)
- userId (Foreign Key → users)
- languageId (Foreign Key → languages)
- createdAt

### Database Schema Diagram

![Database Schema](./frontend/images/er-diagram.png)

---

## Frontend Setup

### Installation Steps

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start development server
```bash
npm run dev
```

Application will run at: `http://localhost:5173`

---

## Conclusion

This AI Code Generation Copilot demonstrates a full-stack implementation with modern web technologies, secure authentication, and AI integration. The application provides a practical solution for developers to quickly generate code snippets in multiple programming languages using natural language descriptions.


--created with love by Shubham Sharma ❤️😊