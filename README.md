# HelpDesk Mini

A comprehensive ticketing system with SLA timers, assignments, threaded comments, searchable timeline, and role-based access control.

## Features

- **Role-based Access Control**: User, Agent, and Admin roles with appropriate permissions
- **SLA Tracking**: Automatic SLA deadline calculation and breach detection
- **Optimistic Locking**: Prevents concurrent update conflicts
- **Threaded Comments**: Full comment system with reply capabilities
- **Search Functionality**: Search across tickets and comments
- **Timeline Logging**: Complete audit trail of all ticket actions
- **Pagination**: Efficient data loading with limit/offset support
- **Rate Limiting**: 60 requests per minute per user
- **Idempotency**: Support for Idempotency-Key headers on POST requests
- **Real-time Updates**: Modern React-based frontend with state management

## Tech Stack

### Backend

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Morgan** for logging

### Frontend

- **Next.js 15** with **React 19**
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Axios** for API client
- **React Context** for state management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd helpdesk-mini
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Copy environment variables
   cp example.env .env

   # Update .env with your MongoDB URI and JWT secret
   # For local development:
   # MONGO_URI=mongodb://localhost:27017/helpdesk-mini
   # JWT_SECRET=your-super-secret-jwt-key

   # Seed the database with test data
   npm run seed

   # Start the development server
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install

   # Create .env.local
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

   # Start the development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## API Documentation

### Base URL

`http://localhost:8000/api`

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "user"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get User Profile

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Ticket Endpoints

#### Create Ticket

```http
POST /api/tickets
Authorization: Bearer <token>
Content-Type: application/json
Idempotency-Key: <optional-unique-key>

{
  "title": "Login Issue",
  "description": "Unable to login to mobile appl.",
  "priority": "high",
  "assignedTo": "<user-id>" // optional
}
```

#### Get Tickets (with pagination and filters)

```http
GET /api/tickets?limit=20&offset=0&status=open&priority=high&search=mobile
Authorization: Bearer <token>
```

#### Get Single Ticket

```http
GET /api/tickets/<ticket-id>
Authorization: Bearer <token>
```

#### Update Ticket

```http
PATCH /api/tickets/<ticket-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "high",
  "assignedTo": "<user-id>",
  "version": <current-version>
}
```

#### Get SLA Breached Tickets

```http
GET /api/tickets/breached?limit=20&offset=0
Authorization: Bearer <token>
```

### Comment Endpoints

#### Create Comment

```http
POST /api/tickets/<ticket-id>/comments
Authorization: Bearer <token>
Content-Type: application/json
Idempotency-Key: <optional-unique-key>

{
  "content": "This is a comment",
  "parentComment": "<parent-comment-id>" // optional for replies
}
```

#### Get Comments

```http
GET /api/tickets/<ticket-id>/comments?limit=20&offset=0
Authorization: Bearer <token>
```

#### Get Timeline

```http
GET /api/tickets/<ticket-id>/timeline?limit=20&offset=0
Authorization: Bearer <token>
```

### System Endpoints

#### Health Check

```http
GET /api/health
```

#### API Metadata

```http
GET /api/_meta
```

#### Hackathon Manifest

```http
GET /.well-known/hackathon.json
```

## Test Credentials

### Pre-seeded Users

- **Admin**: `admin@test.com` / `admin123`
- **Agent**: `agent@test.com` / `agent123`
- **User**: `user@test.com` / `user123`

### Sample Data

The seed script creates:

- 3 test users with different roles
- 4 sample tickets with various priorities and statuses
- Sample comments and timeline entries
- SLA deadline examples for testing

## API Features

### Pagination

All list endpoints support pagination:

```http
GET /api/tickets?limit=20&offset=40
```

Response:

```json
{
  "tickets": [...],
  "pagination": {
    "limit": 20,
    "offset": 40,
    "total": 95,
    "next_offset": 60
  }
}
```

### Rate Limiting

- **Limit**: 60 requests per minute per user
- **Header**: Applied per authenticated user
- **Response**: `429` status with `{"error": {"code": "RATE_LIMIT"}}`

### Idempotency

- **Header**: `Idempotency-Key` for POST requests
- **Duration**: 24 hours
- **Scope**: Per user + endpoint + content hash

### Error Format

Consistent error response format:

```json
{
  "error": {
    "code": "FIELD_REQUIRED",
    "field": "email",
    "message": "Email is required"
  }
}
```

### SLA Calculation

- **Critical**: 2 hours
- **High**: 8 hours
- **Medium**: 24 hours
- **Low**: 72 hours

## Frontend Pages

### Authentication Pages

- `/login` - User login
- `/register` - User registration

### Main Pages

- `/` - Landing page (redirects to tickets if logged in)
- `/tickets` - Ticket list with filters and pagination
- `/tickets/new` - Create new ticket (agents/admins only)
- `/tickets/:id` - Individual ticket details (in progress)

## Role Permissions

### User

- View own tickets
- Create comments on own tickets
- View timeline for own tickets

### Agent

- All User permissions
- Create tickets
- View all tickets
- Update ticket status/priority/assignment
- Create comments on any ticket
- View breached SLA tickets

### Admin

- All Agent permissions
- Access to all tickets regardless of assignment
- Full CRUD operations
- User management capabilities

## Architecture

**Backend Architecture**: RESTful API with Express.js, MongoDB for data persistence, JWT authentication middleware, comprehensive error handling, and modular route structure.

**Frontend Architecture**: Next.js App Router with React Context for state management, TypeScript for type safety, Tailwind CSS for styling, and axios for API communication.

**Database Design**: MongoDB collections for Users, Tickets, Comments, and TimelineLogs with proper indexing and relationships.

**Security**: JWT tokens, bcrypt password hashing, CORS protection, input validation, rate limiting, and role-based access control.

## Development

### Backend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Populate with test data
```

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```
