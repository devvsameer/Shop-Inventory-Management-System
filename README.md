# Shop Inventory Management System

A full-stack inventory and billing application built with a React frontend, Express backend, and MariaDB database. The project includes product listing, search, CRUD operations, and Docker-based setup for local development.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MariaDB
- Containerization: Docker + Docker Compose
- API validation: express-validator

## Project Structure

```text
billing-system/
├── backend/                 # Express API server
│   ├── config/              # Database config
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Validation middleware
│   ├── routes/              # API endpoints
│   ├── services/            # DB/data access helpers
│   ├── tests/               # Backend tests
│   ├── app.js               # Express app setup
│   ├── server.js            # Server entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React app
│   ├── src/                 # Application source code
│   ├── public/              # Static assets
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
├── init-scripts/           # SQL seed/setup scripts
├── db_data/                # Local DB data volume
├── docker-compose.yml      # Multi-container setup
├── .gitignore
├── README.md
└── Designs/                # UI mockups and reference designs
```

## Features

- Product inventory dashboard
- Add, edit, and delete products
- Search products by SKU or name
- Pagination and inventory status tracking
- Low-stock threshold logic
- Docker-ready environment

## Prerequisites

Before running the app, install:

- Node.js (v18+ recommended)
- npm
- Docker Desktop / Docker Engine

## Running with Docker Compose

From the project root:

```bash
docker compose up --build
```

This starts:

- Frontend: http://localhost
- Backend: http://localhost:3000
- Database: localhost:3306

To stop the containers:

```bash
docker compose down
```

To remove local volumes:

```bash
docker compose down -v
```

## Running the Backend Locally

```bash
cd backend
npm install
npm start
```

The backend listens on port `3000`.

## Running the Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

The frontend runs via Vite, usually at:

```text
http://localhost:5173
```

## Environment Variables

The app uses environment variables for database configuration in the backend container setup.

Example values used in Docker Compose:

```env
DB_HOST=database
DB_USER=root
DB_PASSWORD=1234
DB_NAME=inventory
```

## API Overview

Base URL for backend API:

```text
http://localhost:3000
```

Main routes:

- `GET /products` — fetch paginated/search products
- `POST /products` — create a product
- `PUT /products/:sku` — update a product
- `DELETE /products/:sku` — delete a product

## Notes

- The project includes a MariaDB initialization script under `init-scripts/`.
- `db_data/` is used for persistent database storage and is typically ignored by git.
- The frontend is served behind Nginx in Docker, while local development uses Vite.

## License

This project is for local development and educational/demo use unless otherwise specified by the owner.
