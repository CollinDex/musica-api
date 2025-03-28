# Musica API

Musica API is the backend service for the Musica application, a music management system that enables users to manage songs, artists, and playlists. Built using **NestJS** and **TypeORM**, it provides RESTful endpoints for handling music data efficiently.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [License](#license)

## Features
- **User Authentication** (JWT-based login & registration)
- **Advanced Security with Two Factor Authentication**
- **Role Based Access for protected endpoints**
- **API KEY generation**
- **CRUD operations for Users, Songs, Artists, and Playlists**
- **Pagination support for large datasets**
- **Error handling & validation**
- **Built-in database migrations**
- **Optimized queries with TypeORM Query Builder**
- **Data Seeding**

## Tech Stack
- **NestJS** (Backend Framework)
- **TypeORM** (ORM for database management)
- **PostgreSQL** (Relational database support)
- **JWT Authentication** (Secure API access)
- **Docker** (For containerized deployment)
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

3. Set up the environment variables (See [Environment Variables](#environment-variables))

4. Run database migrations:
   ```bash
   npm run migration:run
   ```

5. Start the server:
   ```bash
   npm run start:dev
   ```

## Environment Variables
Create a `.env` file in the project root and configure the following:
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

## API Endpoints
### **Authentication**
| Method | Endpoint            | Description               |
|--------|--------------------|---------------------------|
| POST   | /auth/register     | Register a new user       |
| POST   | /auth/login        | Authenticate user & get token |

### **Songs**
| Method | Endpoint       | Description |
|--------|---------------|-------------|
| GET    | /songs        | Fetch all songs |
| GET    | /songs/:id    | Fetch a single song |
| POST   | /songs        | Create a new song |
| PATCH  | /songs/:id    | Update a song |
| DELETE | /songs/:id    | Delete a song |

### **Artists**
| Method | Endpoint       | Description |
|--------|---------------|-------------|
| GET    | /artists      | Fetch all artists |
| GET    | /artists/:id  | Fetch a single artist |
| POST   | /artists      | Add a new artist |
| PATCH  | /artists/:id  | Update an artist |
| DELETE | /artists/:id  | Remove an artist |

## Database Schema
### **User Entity**
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column() firstName: string;
  @Column() lastName: string;
  @Column({ unique: true }) email: string;
  @Column() password: string;
}
```

### **Song Entity**
```typescript
@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn() id: number;
  @Column() title: string;
  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];
  @Column({ type: 'date' }) releasedDate: Date;
}
```

### **Artist Entity**
```typescript
@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn() id: number;
  @Column() name: string;
  @ManyToMany(() => Song, (song) => song.artists)
  songs: Song[];
}
```

## Error Handling
Musica API uses NestJS's built-in `HttpException` for structured error responses. Example error response:
```json
{
  "statusCode": 400,
  "message": "Validation failed: title is required",
  "error": "Bad Request"
}
```

## License
This project is licensed under the MIT License. Feel free to modify and use it as needed.

