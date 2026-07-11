# AI-Powered Dress Store Management System

A complete full-stack solution for managing a dress store with three roles: Admin, Worker, and Customer.

## Architecture

- Frontend: React + Vite + Tailwind CSS
- Backend: FastAPI + SQLAlchemy + JWT auth
- Database: MySQL
- AI: Heuristic image-based recommendation engine for dress suggestions

## Project Structure

- backend/: FastAPI application and API routes
- frontend/: React application and Tailwind UI
- docs/: architecture and setup notes
- database/: MySQL schema and seed data

## Features

- Secure auth with JWT and role-based access control
- Admin dashboard with statistics and inventory control
- Worker order and stock management
- Customer catalog, cart, orders, and image-based recommendations
- AI-driven dress recommendations from uploaded photos

## Quick Start

1. Create a MySQL database named dress_store.
2. Configure environment variables in backend/.env.
3. Install backend dependencies.
4. Run database migrations or execute the SQL schema.
5. Install frontend dependencies and start the app.

## Environment Variables

```
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/dress_store
SECRET_KEY=change-me
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```
