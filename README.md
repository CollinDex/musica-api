# Musica API

Musica API is the backend service powering Musica — a music community and streaming platform. Built with NestJS and TypeORM, this API enables users to upload, stream, and download songs, receive personalized music recommendations, and connect with other music lovers through real-time chat.

## Table of Contents
- [Summary](#summary)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Summary
Musica API serves as the backbone for a feature-rich music platform that supports:
- Secure authentication with optional two-factor authentication
- Role-based access and API key validation
- Music library management including artists, songs, and playlists
- RESTful APIs with robust validation and error handling
- Seamless integration with a frontend music player interface

## Features
- 🔐 **User Authentication** (JWT-based login & registration)
- 🔒 **Two-Factor Authentication Support**
- 👮 **Role-Based Access Control**
- 🔑 **API Key Generation and Validation**
- 🎵 **CRUD Operations** for Users, Songs, Artists, and Playlists
- 📃 **Paginated Responses** for large datasets
- 🧠 **Optimized Queries** with TypeORM Query Builder
- 🧪 **Built-in Migrations and Data Seeding**
- 📚 **Swagger for API Documentation**
- 🧼 **Global Error Handling and Validation**
- 🧪 **Unit & Integration Tests for Core Modules (Auth, Users, Songs, etc.)**

## Tech Stack
- **NestJS** (Backend Framework)
- **TypeORM** (ORM for database management)
- **PostgreSQL** (Relational database)
- **JWT Authentication** (Secure API access)
- **Docker** (Containerized deployment)
- **Swagger** (API Documentation)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/musica-api.git
   cd musica-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Run database migrations:
   ```bash
   npm run migration:run
   ```

5. Start the development server:
   ```bash
   npm run start:dev
   ```

## Environment Variables
Create a `.env` file in the project root with the following:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=musica_db
JWT_LIMIT=1h
JWT_SECRET=your-secret-key
PORT=3000
```

## Documentation
The full Swagger documentation is available at: `/api/docs`

## API Endpoints (api/v1)
### 🔐 Authentication
| Method | Endpoint                | Description                               |
|--------|--------------------------|-------------------------------------------|
| POST   | /auth/signup             | Register a new user                       |
| POST   | /auth/login              | Authenticate and get JWT token            |
| POST   | /auth/validateApiKey     | Validate a user's API key                 |
| POST   | /auth/enable-2fa         | Enable 2FA and return a 2FA secret        |
| POST   | /auth/disable-2fa        | Disable 2FA                               |
| POST   | /auth/validate-2fa       | Validate user-provided 2FA code           |

### 🎵 Songs
| Method | Endpoint       | Description         |
|--------|----------------|---------------------|
| GET    | /songs         | Fetch all songs     |
| GET    | /songs/:id     | Fetch a single song |
| POST   | /songs         | Create a new song   |
| PATCH  | /songs/:id     | Update a song       |
| DELETE | /songs/:id     | Delete a song       |

### 🎤 Artists
| Method | Endpoint       | Description             |
|--------|----------------|-------------------------|
| GET    | /artists       | Fetch all artists       |
| GET    | /artists/:id   | Fetch a single artist   |
| POST   | /artists       | Add a new artist        |
| PATCH  | /artists/:id   | Update an artist        |
| DELETE | /artists/:id   | Delete an artist        |

### 🎶 Playlists
| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | /playlists       | Get all playlists        |
| GET    | /playlists/:id   | Get a specific playlist  |
| POST   | /playlists       | Create a new playlist    |
| PATCH  | /playlists/:id   | Update a playlist        |
| DELETE | /playlists/:id   | Delete a playlist        |

## License
This project is licensed under the **MIT License**. You’re free to use, modify, and distribute it as needed.

