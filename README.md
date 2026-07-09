# 🔮 Mystic Tarot

A full-stack digital tarot consultation platform built with a microservices architecture. Clients can book personalised human readings or receive instant AI-powered interpretations — all wrapped in a dreamy, celestial UI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17, Angular Material, Tailwind CSS |
| API Gateway | ASP.NET Core 10, YARP Reverse Proxy |
| Identity | ASP.NET Core 10, EF Core, BCrypt, JWT |
| Bookings | ASP.NET Core 10, EF Core, RabbitMQ |
| Readings | ASP.NET Core 10, EF Core, OpenAI API, RabbitMQ |
| Notifications | .NET 10 Worker Service, RabbitMQ |
| Database | SQL Server 2022 |
| Message Broker | RabbitMQ 3 |
| Containers | Docker + Docker Compose |

## Architecture

```
tarot-app/
├── docker-compose.yml
├── backend/
│   ├── ApiGateway/          # YARP reverse proxy — port 5000
│   ├── IdentityService/     # Auth & JWT — port 5001
│   ├── BookingService/      # Booking management — port 5002
│   ├── ReadingService/      # AI tarot readings — port 5003
│   └── NotificationService/ # RabbitMQ event consumer — port 5004
└── frontend/
    └── tarot-angular/       # Angular 17 SPA — port 4200
```

## Features

- **AI Readings** — Draw cards and receive mystical GPT-4o-mini interpretations across three spread types: Single Card, Three Card, and Celtic Cross
- **Human Bookings** — Book sessions with a human reader with full status tracking (Pending → Confirmed → Completed)
- **JWT Auth** — Role-based access control with three roles: Admin, Reader, and Client, each with scoped token permissions
- **Event-Driven** — RabbitMQ topic exchange publishes `BookingConfirmed`, `BookingCancelled`, and `ReadingCompleted` events between services
- **Full 78-Card Deck** — All Major and Minor Arcana with upright and reversed meanings, random card draws with orientation

## Quick Start

### Run with Docker

```bash
# 1. Copy and configure environment
cp .env.example .env
# Edit .env — add your OPENAI_API_KEY

# 2. Start everything
docker-compose up --build
```

### Run Locally

```bash
# Backend — run each in a separate terminal
cd backend/IdentityService && dotnet run      # http://localhost:5001
cd backend/BookingService && dotnet run       # http://localhost:5002
cd backend/ReadingService && dotnet run       # http://localhost:5003
cd backend/ApiGateway && dotnet run           # http://localhost:5000

# Frontend
cd frontend/tarot-angular
npm install
npm start                                      # http://localhost:4200
```

## Service URLs

| Service | Local URL | Swagger |
|---------|-----------|---------|
| Frontend | http://localhost:4200 | — |
| API Gateway | http://localhost:5000 | — |
| Identity | http://localhost:5001 | http://localhost:5001/swagger |
| Bookings | http://localhost:5002 | http://localhost:5002/swagger |
| Readings | http://localhost:5003 | http://localhost:5003/swagger |
| RabbitMQ UI | http://localhost:15672 | guest / guest |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SA_PASSWORD` | SQL Server SA password |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `OPENAI_API_KEY` | OpenAI API key for AI readings |
| `RABBITMQ_HOST` | RabbitMQ hostname (default: `rabbitmq`) |
| `RABBITMQ_USER` | RabbitMQ username (default: `guest`) |
| `RABBITMQ_PASS` | RabbitMQ password (default: `guest`) |

## API Endpoints

### Identity (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✓ | Get current user |

### Bookings (`/api/bookings`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | ✓ | Create booking |
| GET | `/api/bookings` | Admin/Reader | All bookings |
| GET | `/api/bookings/my` | ✓ | My bookings |
| PUT | `/api/bookings/{id}/confirm` | Admin/Reader | Confirm booking |
| PUT | `/api/bookings/{id}/cancel` | ✓ | Cancel booking |

### Readings (`/api/readings`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/readings/ai` | ✓ | Perform AI reading |
| GET | `/api/readings/my` | ✓ | Reading history |
| GET | `/api/readings/cards` | — | All 78 tarot cards |
| POST | `/api/readings/cards/draw` | — | Draw random cards |
