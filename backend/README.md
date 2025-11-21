# Code Generation Co-pilot - Backend

A robust Node.js backend API for an AI-powered code generation application using TypeScript, Express, Prisma, PostgreSQL, and Google's Gemini AI.

## 🚀 Features

- **AI-Powered Code Generation**: Generate code in multiple programming languages using Google Gemini AI
- **Multi-Language Support**: Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust
- **Database Persistence**: Store and retrieve code generation history with PostgreSQL
- **Pagination**: Efficient paginated history retrieval
- **Input Validation**: Zod-based request validation
- **Error Handling**: Comprehensive error handling with detailed messages
- **CORS Support**: Configurable CORS for frontend integration
- **Type Safety**: Full TypeScript implementation

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

4. **Set up the database**
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed languages
npm run prisma:seed
```

5. **Start the development server**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### 1. Get All Languages
**GET** `/api/languages`

Returns all available programming languages.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Python",
      "code": "python"
    }
  ]
}
```

### 2. Generate Code
**POST** `/api/generate`

Generate code using AI based on a natural language prompt.

**Request Body:**
```json
{
  "prompt": "Write a Python function to reverse a string",
  "language": "python"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "prompt": "Write a Python function to reverse a string",
    "language": "python",
    "code": "def reverse_string(s):\n    return s[::-1]",
    "timestamp": "2025-11-21T10:30:00.000Z"
  }
}
```

**Validation:**
- `prompt`: 10-1000 characters
- `language`: Must be a valid language code (python, javascript, typescript, java, cpp, csharp, go, rust)

### 3. Get Generation History
**GET** `/api/history`

Retrieve paginated history of all code generations.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)

**Example:** `/api/history?page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "prompt": "Write a Python function to reverse a string",
      "language": "python",
      "code": "def reverse_string(s):\n    return s[::-1]",
      "timestamp": "2025-11-21T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 45,
    "itemsPerPage": 10,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐         ┌──────────────────┐
│   Language      │         │   Generation     │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │◄────────┤ id (PK)          │
│ name            │  1    * │ prompt           │
│ slug (UNIQUE)   │         │ code             │
│ createdAt       │         │ languageId (FK)  │
└─────────────────┘         │ createdAt        │
                            └──────────────────┘
```

### Schema Explanation

**Language Table:**
- Stores supported programming languages
- **Normalization**: Separates language data into its own table (3NF)
- **Constraints**: 
  - Primary key on `id`
  - Unique constraint on `slug` for URL-safe identifiers
  - Unique constraint on `name` to prevent duplicates

**Generation Table:**
- Stores each code generation request and result
- **Foreign Key**: `languageId` references `Language(id)` ensuring referential integrity
- **Indexes**: 
  - `createdAt DESC` for efficient pagination queries
  - `languageId` for filtering by language
- **Data Types**: 
  - `prompt` and `code` use `TEXT` type for large content

### Design Decisions

1. **Normalization**: Language data is normalized into a separate table to avoid redundancy and ensure consistency
2. **Indexing**: Indexes on `createdAt` and `languageId` optimize common query patterns
3. **Referential Integrity**: Foreign key constraint ensures all generations reference valid languages
4. **Future Extensibility**: Schema can easily be extended to add user authentication, favorites, ratings, etc.

## ⚡ Performance & Complexity

### Time Complexity

**Paginated History Retrieval:**
- **Without Index**: O(n) - Full table scan
- **With Index on createdAt**: O(log n + k) where k is the page size
  - Index lookup: O(log n)
  - Retrieving k records: O(k)
  - With proper indexing, pagination is extremely efficient even with millions of records

### Query Performance

1. **Index on `createdAt DESC`**: 
   - Speeds up ORDER BY queries
   - Enables efficient OFFSET/LIMIT pagination
   - Reduces query time from seconds to milliseconds for large datasets

2. **Index on `languageId`**:
   - Optimizes joins between Generation and Language tables
   - Speeds up filtering by language
   - Essential for foreign key lookups

### When Indexes Are Useful

- **Large Datasets**: Critical when table has >10,000 rows
- **Frequent Queries**: On columns used in WHERE, ORDER BY, or JOIN clauses
- **Read-Heavy Operations**: Indexes optimize SELECT queries (trade-off: slightly slower writes)

## 🔧 Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:seed      # Seed initial data
```

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── src/
│   ├── config/
│   │   ├── database.ts    # Prisma client configuration
│   │   ├── env.ts         # Environment variables
│   │   └── gemini.ts      # Gemini AI configuration
│   ├── controllers/
│   │   ├── generation.controller.ts
│   │   └── language.controller.ts
│   ├── services/
│   │   ├── gemini.service.ts
│   │   ├── generation.service.ts
│   │   └── language.service.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── generation.routes.ts
│   │   └── language.routes.ts
│   ├── middleware/
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── validation.ts
│   └── index.ts           # Application entry point
├── .env                   # Environment variables (not in git)
├── .env.example          # Environment template
├── package.json
└── tsconfig.json
```

## 🐛 Troubleshooting

### Gemini API Rate Limit Error

If you see "429 Too Many Requests":
- **Free Tier Limits**: The free tier has very limited requests per minute
- **Solution 1**: Wait for the retry delay specified in the error
- **Solution 2**: Get a new API key at https://aistudio.google.com/app/apikey
- **Solution 3**: Enable billing in Google Cloud Console for higher quotas

### Database Connection Error

- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env` file
- Ensure database exists: `createdb database_name`

## 🔒 Security Considerations

- API keys are stored in environment variables (never committed to git)
- Input validation using Zod schemas
- SQL injection protection via Prisma ORM
- CORS configuration for frontend security

## 📝 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI**: Google Gemini AI
- **Validation**: Zod
- **CORS**: cors middleware

## 🚀 Deployment

For production deployment:

1. Build the application: `npm run build`
2. Set `NODE_ENV=production` in environment
3. Use a process manager like PM2
4. Configure reverse proxy (nginx/Apache)
5. Set up SSL certificate
6. Use environment-specific `.env` files

## 📄 License

MIT License
