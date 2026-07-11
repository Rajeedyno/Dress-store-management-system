# Architecture Overview

## Components

- React frontend for dashboards and user flows
- FastAPI backend with JWT auth and REST endpoints
- MySQL database for persistent business entities
- AI recommendation module using a simple heuristic model based on uploaded image metadata and apparel category rules

## Request Flow

1. User authenticates and receives a JWT.
2. Frontend sends the token to protected API endpoints.
3. Backend validates role and performs CRUD or business logic operations.
4. Inventory is updated on purchase; low-stock indicators are exposed to admin and worker views.
5. Uploaded image data is stored and recommendations are generated using heuristic scoring.

## Database Entities

- roles
- users
- dresses
- inventory
- orders
- order_items
- recommendations
- uploaded_images
