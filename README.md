# Flight Booking Application

A full-stack flight booking application built with Spring Boot, GraphQL, React, and PostgreSQL. Users can search for flights, make bookings, and receive confirmation details.

## Features

- **Flight Search**: Search flights by origin, destination, and departure date
- **Real-time Results**: Sort flights by price, duration, or departure time
- **Booking Management**: Complete booking with passenger information
- **Confirmation**: View booking confirmation with unique reference number
- **GraphQL API**: Efficient data fetching with GraphQL
- **Responsive UI**: Modern Material-UI design
- **Dockerized**: Full Docker support with Docker Compose
- **Seeded Data**: Database migrations include test flight data for local development

## Tech Stack

### Backend
- **Java 22** with Spring Boot 3.2.1
- **Spring for GraphQL** - GraphQL API implementation
- **Spring Data JPA** - Database access layer
- **PostgreSQL 15** - Relational database
- **Liquibase** - Database migration management
- **Gradle 8.12** - Build tool
- **JUnit 5** - Unit and integration testing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Apollo Client** - GraphQL client
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Nginx** - Production web server

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Prerequisites

- **Docker** and **Docker Compose** (for containerized deployment)
- **Java 22** and **Gradle 8.12** (for local backend development)
- **Node.js 20+** and **npm** (for local frontend development)
- **PostgreSQL 15** (for local database)

## Quick Start with Docker Compose

The easiest way to run the entire application:

```bash
# Clone the repository
git clone <repository-url>
cd travel-app

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend GraphQL API: http://localhost:8080/graphql
- GraphiQL Playground: http://localhost:8080/graphiql (dev mode only)
- Database: localhost:5432

## Local Development Setup

### Backend

```bash
cd backend

# Configure database connection (create application-dev.properties or set env vars)
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/flightbooking
export SPRING_DATASOURCE_USERNAME=flightuser
export SPRING_DATASOURCE_PASSWORD=flightpass

# Run the application
./gradlew bootRun

# Run tests
./gradlew test

# Build JAR
./gradlew bootJar
```

The backend will start on http://localhost:8080

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "VITE_GRAPHQL_URI=http://localhost:8080/graphql" > .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend will start on http://localhost:5173 (dev mode) or http://localhost:4173 (preview mode)

### Database Setup

```bash
# Start PostgreSQL with Docker
docker run -d \
  --name flight-booking-db \
  -e POSTGRES_DB=flightbooking \
  -e POSTGRES_USER=flightuser \
  -e POSTGRES_PASSWORD=flightpass \
  -p 5432:5432 \
  postgres:15-alpine
```

Liquibase will automatically create the schema and seed data when the backend starts.

## Project Structure

```
.
├── backend/                  # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/travelapp/
│   │   │   │   ├── controller/      # GraphQL controllers
│   │   │   │   ├── model/           # JPA entities
│   │   │   │   ├── repository/      # Data access layer
│   │   │   │   ├── service/         # Business logic
│   │   │   │   └── dto/             # Data transfer objects
│   │   │   └── resources/
│   │   │       ├── db/changelog/    # Liquibase migrations
│   │   │       ├── graphql/         # GraphQL schema
│   │   │       └── application*.properties
│   │   └── test/                    # Unit and integration tests
│   ├── build.gradle
│   └── Dockerfile
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── graphql/         # GraphQL queries and mutations
│   │   ├── apollo/          # Apollo Client configuration
│   │   └── App.jsx          # Root component with routing
│   ├── package.json
│   ├── nginx.conf           # Nginx configuration for production
│   └── Dockerfile
│
├── docker-compose.yml       # Multi-container configuration
├── .env.example            # Environment variables template
└── README.md               # This file
```

## API Documentation

### GraphQL Schema

**Queries:**
- `searchFlights(origin, destination, departureDate, passengers)` - Search available flights
- `flight(id)` - Get flight by ID
- `getBooking(bookingReference)` - Get booking details

**Mutations:**
- `createBooking(input: BookingInput!)` - Create a new booking

**Example Query:**
```graphql
query SearchFlights {
  searchFlights(
    origin: "New York (JFK)"
    destination: "Los Angeles (LAX)"
    departureDate: "2026-02-15"
    passengers: 1
  ) {
    id
    flightNumber
    airline
    departureTime
    arrivalTime
    price
    availableSeats
  }
}
```

**Example Mutation:**
```graphql
mutation CreateBooking {
  createBooking(input: {
    flightId: 1
    passengerName: "John Doe"
    passengerEmail: "john@example.com"
    passengerPhone: "1234567890"
  }) {
    success
    message
    booking {
      bookingReference
      status
    }
  }
}
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
./gradlew test

# Run specific test class
./gradlew test --tests FlightServiceTest

# Generate test report
./gradlew test jacocoTestReport
```

**Test Coverage:**
- Unit tests for service layer (FlightService, BookingService)
- Integration tests for repository layer (note: Testcontainers may require Docker compatibility)

### Frontend Tests

```bash
cd frontend

# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## Environment Variables

See `.env.example` for all configurable variables.

**Backend:**
- `SPRING_DATASOURCE_URL` - PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `SPRING_PROFILES_ACTIVE` - Active Spring profile (dev, test, prod)

**Frontend:**
- `VITE_GRAPHQL_URI` - GraphQL API endpoint URL

## Database Schema

**Tables:**
- `flights` - Available flights with schedule and pricing
- `bookings` - Customer booking records

**Seeded Data:**
- 30 sample flights across 5 major US routes
- Various airlines, aircraft types, and price points

## Known Issues

### Testcontainers Docker Compatibility

The integration test (`FlightRepositoryIntegrationTest`) uses Testcontainers to spin up a PostgreSQL container for testing. There's a known compatibility issue between the docker-java client library and Docker Desktop 29.x that may cause the test to fail with:

```
java.lang.IllegalStateException: Could not find a valid Docker environment
```

**Workarounds:**
1. **Use Docker Desktop 28.x or earlier** (recommended for local development)
2. **Run tests in CI/CD** where Docker compatibility is ensured
3. **Skip integration tests locally**: `./gradlew test -x integrationTest`

The unit tests provide comprehensive coverage and run successfully without Docker.

## Production Deployment

### Building Images

```bash
# Build backend image
docker build -t flight-booking-backend ./backend

# Build frontend image
docker build -t flight-booking-frontend ./frontend
```

### Docker Compose Production

```bash
# Start in detached mode
docker-compose up -d

# View service status
docker-compose ps

# View logs for specific service
docker-compose logs -f backend

# Scale services (if needed)
docker-compose up -d --scale backend=3

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v
```

## Security Considerations

- Backend runs as non-root user in container
- Nginx security headers configured (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Input validation on all user inputs
- Parameterized queries to prevent SQL injection
- CORS configured for frontend origin only
- Environment variables for sensitive configuration
- Application auth and authorization are planned for the next iteration

## Future Enhancements

- User authentication and authorization
- Payment integration
- Email notifications for bookings
- Booking cancellation and modification
- Multi-passenger support
- Seat selection
- Loyalty program integration
- Admin dashboard
- Flight status updates
- Search filters (stops, airline, time of day)

## License

[Your License Here]

## Contributing

[Your Contributing Guidelines Here]
