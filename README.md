# National Group India - Construction Management System

A comprehensive construction site management application built with SvelteKit frontend and Node.js backend, featuring real-time project tracking, daily updates, and resource management.

## 🏗️ Features

### Core Modules
- **Status Board**: Real-time project status tracking with progress indicators
- **Labor Management**: Track staff, NMT workers, and contractors
- **Materials & P&M**: Inventory management for materials and plant & machinery
- **Daily Updates**: Shift-wise progress reports with date range filtering
- **Construction Phases**: Track multiple construction categories:
  - Construction
  - Electrical
  - Mechanical
  - Consumable
  - Safety
  - QA & QC

### Dashboard Features
- **Real-time Statistics**: Active projects, progress tracking, manpower monitoring
- **Date Range Controls**: Filter data by custom date ranges
- **Visual Progress Indicators**: Progress bars and status badges
- **Gold & Off-white Theme**: Professional construction industry styling

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or later
- npm or yarn

### Installation & Setup

1. **Install dependencies**:
   ```bash
   npm ci
   ```

2. **Configure required environment variables** in a local `.env` file (see `.env.example`) or in the deployment platform. Never commit the populated `.env` file.

3. **Start the application**:
   ```bash
   # Start both frontend and backend
   npm run dev:all
   
   # Or start individually:
   npm run server    # Backend API (port 3001)
   npm run dev       # Frontend (port 5173/5174)
   ```

4. **Access the application**:
   - **Frontend Dashboard**: http://localhost:5174
   - **Backend API**: http://localhost:3001
   - **API Health Check**: http://localhost:3001/api/health

## 📊 API Endpoints

### Status & Phases
- `GET /api/status` - Get all status board items
- `GET /api/status/phases` - Get construction phases
- `PUT /api/status/phases/:id` - Update phase progress
- `POST /api/status` - Create new status item

### Labor Management
- `GET /api/labor` - Get all labor records
- `GET /api/labor/type/:type` - Get labor by type (STAFF/NMT/CONTRACT)
- `POST /api/labor` - Add new labor record
- `PUT /api/labor/:id` - Update labor record

### Materials & Plant & Machinery
- `GET /api/materials` - Get all materials
- `GET /api/materials/pm` - Get plant & machinery
- `GET /api/materials/category/:category` - Get materials by category
- `POST /api/materials` - Add new material
- `POST /api/materials/pm` - Add plant & machinery

### Daily Updates
- `GET /api/daily-updates` - Get daily updates (with date filtering)
- `GET /api/daily-updates/date/:date` - Get updates for specific date
- `GET /api/daily-updates/stats` - Get summary statistics
- `POST /api/daily-updates` - Create daily update
- `PUT /api/daily-updates/:id` - Update daily update

## 🗄️ Database Schema

The application uses **PostgreSQL** database via **Prisma ORM** with the following main tables:

- **status_board**: Project status tracking
- **construction_phases**: Phase-wise progress tracking
- **labor**: Worker and staff management
- **materials**: Material inventory
- **plant_machinery**: Equipment tracking (own/rented)
- **daily_updates**: Daily progress reports

## 🎨 Design System

### Color Scheme
- **Primary Gold**: #d4af37
- **Secondary Gold**: #b8860b
- **Light Gold**: #f7e98e
- **Off-white**: #fffbf0
- **Cream**: #f5f5dc

### Status Colors
- **Success**: #2d7d32 (Completed)
- **Warning**: #f57c00 (In Progress)
- **Info**: #1976d2 (Not Started)
- **Danger**: #c62828 (On Hold)

## 📱 Responsive Design

The application is fully responsive with:
- Desktop-first design
- Mobile-friendly sidebar navigation
- Adaptive grid layouts
- Touch-friendly controls

## 🛠️ Technology Stack

### Frontend
- **SvelteKit**: Modern web framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool
- **Lucide Svelte**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **PostgreSQL**: Production database
- **Prisma**: Modern ORM with type safety
- **CORS**: Cross-origin requests

### Development Tools
- **Concurrently**: Run multiple commands
- **dotenv**: Environment configuration
- **TypeScript**: Type checking

## 📋 Project Structure

```
project-a/
├── src/                    # SvelteKit frontend
│   ├── routes/            # Page components
│   ├── lib/               # Shared components
│   └── app.css           # Global styles
├── server/                # Node.js backend
│   ├── database/         # Database setup
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
├── static/               # Static assets
└── package.json          # Dependencies & scripts
```

## 🚦 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type checking

## 🔧 Environment Variables

`JWT_SECRET` and `DATABASE_URL` are required before the API can start. The Node server loads `.env.${NODE_ENV}` when present, otherwise `.env`, from its current working directory. Generate a private secret locally with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`; do not paste the generated value into source control, issue comments, or logs. Changing it invalidates existing JWTs.

`DATABASE_URL` must be a valid PostgreSQL connection URL for Prisma. URL-encode special characters in credentials. The application checks that this variable is non-empty at startup and reports connection failures without printing the URL.

`ALLOWED_ORIGINS` is an optional comma-separated list of exact browser origins, including scheme and port where applicable. Development defaults to localhost ports 5173/5174. Production has no cross-origin defaults, so configure every required frontend origin explicitly. CORS only controls browser access to responses; it does not authenticate or authorize API requests.

The API applies a global per-IP limit (`RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`), a failed-attempt limit on login/register/refresh, and per-operational-route limits (`OPERATIONAL_RATE_LIMIT_WINDOW_MS`, `OPERATIONAL_RATE_LIMIT_MAX_REQUESTS`). The current `express-rate-limit` memory store is local to each process. PM2 cluster workers and separate Netlify Function instances therefore do not share counters; use a shared store if an aggregate cross-instance quota is required. No shared rate-limit store is currently configured.

For Netlify Functions, configure `JWT_SECRET`, `DATABASE_URL`, and `ALLOWED_ORIGINS` in the site's environment variables for the functions' deploy context. Netlify does not load the local `.env` file. For the Node/PM2 server, provide the same variables through the process environment or a protected `.env` file. Do not set production values in this repository or run deployment commands during local validation.

The Node process (`npm run server` / `ecosystem.config.js`) and Netlify Function (`netlify/functions/api.js`, routed by `netlify.toml`) are the supported API entry points. Both validate required configuration and install shared security middleware. The CI runner uses Node 20; `package.json` supports Node 20 or later.

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=
DATABASE_URL=
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

Copy `.env.example` to `.env`, then fill in the required values locally. See `prisma/schema.prisma` for the database provider and schema.

## 🏢 About National Group India

National Group India is committed to delivering excellence in construction management through innovative technology solutions that enhance productivity, safety, and project visibility.

---

**Built with ❤️ for National Group India Construction Team**
