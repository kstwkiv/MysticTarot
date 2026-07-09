# 🔮 Mystic Tarot — Full Stack Web Application

A complete tarot reading web application built with a microservices architecture.

## Architecture

```
tarot-app/
├── docker-compose.yml          # Orchestrates all services
├── .env.example                # Environment variable template
├── backend/
│   ├── ApiGateway/             # YARP reverse proxy (port 5000)
│   ├── IdentityService/        # Auth & JWT (port 5001)
│   ├── BookingService/         # Booking management (port 5002)
│   ├── ReadingService/         # AI tarot readings (port 5003)
│   └── NotificationService/    # Event consumer (port 5004)
└── frontend/
    └── tarot-angular/          # Angular 17 SPA (port 4200)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17, Angular Material, Tailwind CSS |
| API Gateway | ASP.NET Core 8, YARP Reverse Proxy |
| Identity | ASP.NET Core 8, EF Core, BCrypt, JWT |
| Bookings | ASP.NET Core 8, EF Core, RabbitMQ |
| Readings | ASP.NET Core 8, EF Core, OpenAI API, RabbitMQ |
| Notifications | .NET 8 Worker Service, RabbitMQ |
| Database | SQL Server 2022 |
| Message Broker | RabbitMQ 3 |
| Container | Docker + Docker Compose |

## Quick Start

### 1. Clone and configure

```bash
cp .env.example .env
# Edit .env with your values, especially OPENAI_API_KEY
```

### 2. Start all services

```bash
docker-compose up --build
```

### 3. Access the application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| API Gateway | http://localhost:5000 |
| Identity Service | http://localhost:5001/swagger |
| Booking Service | http://localhost:5002/swagger |
| Reading Service | http://localhost:5003/swagger |
| RabbitMQ Management | http://localhost:15672 (guest/guest) |

## Features

### 🔐 Authentication
- Register as Client, Reader, or Admin
- JWT-based authentication with role-based scopes
- Secure password hashing with BCrypt

### 🔮 AI Readings
- Three spread types: Single Card, Three Card, Celtic Cross
- Full 78-card deck (Major + Minor Arcana)
- GPT-4o-mini powered mystical interpretations
- Reading history saved per user

### 📅 Bookings
- Book Human or AI readings
- Date/time picker with available slots
- Status tracking: Pending → Confirmed → Completed
- Admin can confirm/cancel bookings

### 🔔 Notifications
- RabbitMQ event-driven notifications
- Events: BookingConfirmed, BookingCancelled, ReadingCompleted
- Extensible for email/SMS integration

### 👑 Admin Dashboard
- View all bookings across all users
- Confirm or cancel bookings
- Filter by status

## Development

### Running services individually

```bash
# Identity Service
cd backend/IdentityService
dotnet run

# Booking Service
cd backend/BookingService
dotnet run

# Reading Service
cd backend/ReadingService
dotnet run

# Notification Service
cd backend/NotificationService
dotnet run

# API Gateway
cd backend/ApiGateway
dotnet run

# Frontend
cd frontend/tarot-angular
npm install
npm start
```

### Database Migrations

Each service uses EF Core with `db.Database.Migrate()` on startup, which automatically applies migrations. To create new migrations:

```bash
cd backend/IdentityService
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SA_PASSWORD` | SQL Server SA password | `YourStrong@Passw0rd` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | — |
| `OPENAI_API_KEY` | OpenAI API key for readings | — |
| `RABBITMQ_HOST` | RabbitMQ hostname | `rabbitmq` |
| `RABBITMQ_USER` | RabbitMQ username | `guest` |
| `RABBITMQ_PASS` | RabbitMQ password | `guest` |

## API Endpoints

### Identity Service (`/api/auth`)
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and get JWT
- `GET /api/auth/me` — Get current user info (auth required)

### Booking Service (`/api/bookings`)
- `POST /api/bookings` — Create booking (auth required)
- `GET /api/bookings` — Get all bookings (Reader/Admin)
- `GET /api/bookings/my` — Get my bookings (auth required)
- `GET /api/bookings/{id}` — Get booking by ID
- `PUT /api/bookings/{id}/confirm` — Confirm booking (Reader/Admin)
- `PUT /api/bookings/{id}/cancel` — Cancel booking

### Reading Service (`/api/readings`)
- `POST /api/readings/ai` — Perform AI reading (auth required)
- `GET /api/readings/my` — Get my reading history (auth required)
- `GET /api/readings/{id}` — Get reading by ID
- `POST /api/readings/cards/draw` — Draw random cards
- `GET /api/readings/cards` — Get all 78 tarot cards

## JWT Scopes by Role

| Role | Scopes |
|------|--------|
| Admin | `admin readings bookings clients` |
| Reader | `readings bookings clients` |
| Client | `readings bookings` |
