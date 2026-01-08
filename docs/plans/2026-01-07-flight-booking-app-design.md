# Flight Booking Application - Design Document

**Date:** 2026-01-07
**Purpose:** Flight search and booking platform with simulated checkout flow

---

## Overview

A web-based flight booking application that allows users to search for flights, compare options, and complete simulated bookings. The application uses a modern stack with React frontend, Spring Boot backend, GraphQL API, and PostgreSQL database.

---

## Project Structure & Architecture

### Monorepo Layout

```
travel-app/
├── frontend/           # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/            # Spring Boot application
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── build.gradle
├── docs/
│   └── plans/
├── docker-compose.yml
└── README.md
```

### Communication Flow

- **Development:** React dev server (localhost:3000) makes GraphQL queries to Spring Boot (localhost:8080/graphql)
- **Production:** Spring Boot serves the built React static files and handles GraphQL requests on a single port

### Technology Stack

- **Frontend:** React 18+ with Material-UI (MUI), React Router, Apollo Client (GraphQL client)
- **Backend:** Spring Boot 3.x with Spring for GraphQL, Spring Data JPA, Gradle
- **Database:** PostgreSQL with sample flight data
- **Build Tools:** npm/Vite for React, Gradle for Spring Boot
- **Infrastructure:** Docker & Docker Compose for all components

### Key Design Decisions

- GraphQL API with queries for flight search and mutations for bookings
- React uses Apollo Client for GraphQL queries and caching
- Spring Boot focuses purely on data and business logic
- No authentication layer (keeping it simple)
- Simulated booking (no real payment processing)
- Prefer Spring Boot's built-in modules over external libraries
- Liquibase for database migrations and seed data management

---

## Data Model & Database Schema

### Core Entities

**Flight Table:**
- `id` (Primary Key, UUID or Long)
- `flight_number` (String, e.g., "UA1234")
- `airline` (String, e.g., "United Airlines")
- `origin` (String, airport code e.g., "SFO")
- `destination` (String, airport code e.g., "JFK")
- `departure_time` (DateTime)
- `arrival_time` (DateTime)
- `duration_minutes` (Integer)
- `price` (Decimal)
- `stops` (Integer, 0 for nonstop)
- `aircraft_type` (String, e.g., "Boeing 737")
- `available_seats` (Integer)

**Booking Table:**
- `id` (Primary Key, UUID)
- `flight_id` (Foreign Key to Flight)
- `booking_reference` (String, generated e.g., "ABC123")
- `passenger_name` (String)
- `passenger_email` (String)
- `passenger_phone` (String)
- `booking_date` (DateTime)
- `status` (Enum: CONFIRMED, CANCELLED)

### Design Rationale

- Flights are pre-seeded with realistic data (various routes, times, airlines)
- Simple schema - no complex relationships needed for MVP
- Bookings reference flights but don't decrement seat inventory (simulated flow)
- Booking reference is auto-generated for confirmation display
- DateTime fields use UTC, timezone handling done in application layer
- Prices stored as decimal to avoid floating-point issues

---

## GraphQL API Schema

### Query Types

```graphql
type Query {
  searchFlights(
    origin: String!
    destination: String!
    departureDate: String!
    passengers: Int = 1
  ): [Flight!]!

  flight(id: ID!): Flight

  booking(bookingReference: String!): Booking
}

type Flight {
  id: ID!
  flightNumber: String!
  airline: String!
  origin: String!
  destination: String!
  departureTime: String!
  arrivalTime: String!
  durationMinutes: Int!
  price: Float!
  stops: Int!
  aircraftType: String!
  availableSeats: Int!
}

type Booking {
  id: ID!
  bookingReference: String!
  flight: Flight!
  passengerName: String!
  passengerEmail: String!
  passengerPhone: String!
  bookingDate: String!
  status: BookingStatus!
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
}
```

### Mutation Types

```graphql
type Mutation {
  createBooking(input: BookingInput!): BookingResult!
}

input BookingInput {
  flightId: ID!
  passengerName: String!
  passengerEmail: String!
  passengerPhone: String!
}

type BookingResult {
  success: Boolean!
  booking: Booking
  message: String
}
```

### Design Rationale

- `searchFlights` is the main query - returns list of matching flights
- Dates as strings (ISO format) for simplicity
- `createBooking` mutation returns structured result with success flag
- Optional `flight` and `booking` queries for detail views
- Clean, self-documenting schema following GraphQL best practices

---

## Frontend Component Structure & User Flow

### React Component Hierarchy

```
App (Router setup)
├── SearchPage
│   ├── SearchForm (origin, destination, date inputs)
│   └── FlightResults (conditional render after search)
│       ├── SortControls (price/duration/time dropdown)
│       └── FlightCard (individual flight display)
│           └── BookButton
├── BookingPage
│   ├── FlightSummary (selected flight details)
│   ├── PassengerForm (name, email, phone)
│   └── ConfirmButton
└── ConfirmationPage
    └── BookingConfirmation (reference number, flight details)
```

### User Flow

1. **Search:** User lands on SearchPage, enters origin/destination/date, submits
2. **Results:** FlightResults renders with list of FlightCards, user can sort by price, duration, or departure time
3. **Select:** User clicks "Book" on a FlightCard, navigates to BookingPage with flight ID in URL
4. **Details:** User fills out PassengerForm with their information
5. **Confirm:** User clicks confirm, GraphQL mutation executes
6. **Success:** Navigate to ConfirmationPage showing booking reference and details

### State Management

- Apollo Client cache handles flight search results and booking data
- React Router handles navigation and URL params (flight ID)
- Local component state for form inputs
- No global state management library needed (Apollo cache is sufficient)

### Routing

- `/` - SearchPage (home)
- `/book/:flightId` - BookingPage
- `/confirmation/:bookingReference` - ConfirmationPage

---

## Backend Implementation Structure

### Spring Boot Package Structure

```
com.travelapp
├── config/
│   └── DatabaseConfig.java (if needed for custom PostgreSQL settings)
├── model/
│   ├── Flight.java (JPA entity)
│   └── Booking.java (JPA entity)
├── repository/
│   ├── FlightRepository.java (Spring Data JPA)
│   └── BookingRepository.java (Spring Data JPA)
├── service/
│   ├── FlightService.java (business logic)
│   └── BookingService.java (booking creation, reference generation)
├── controller/
│   ├── FlightController.java (GraphQL @QueryMapping)
│   └── BookingController.java (GraphQL @MutationMapping)
└── TravelAppApplication.java (main class)
```

### Key Components

**FlightService:**
- `searchFlights(origin, destination, date)` - queries repository with filters
- Sorting logic for results (by price, duration, departure time)
- Date parsing and validation

**BookingService:**
- `createBooking(flightId, passengerDetails)` - creates booking record
- `generateBookingReference()` - creates unique 6-character alphanumeric reference
- `getBookingByReference(reference)` - retrieves booking details

### Database Management with Liquibase

- Migration files in `src/main/resources/db/changelog/`
- `db.changelog-master.yaml` (or XML) as the main changelog
- `001-create-flight-table.sql` - initial flight schema
- `002-create-booking-table.sql` - booking schema with foreign key
- `003-seed-flight-data.sql` - insert 20-30 sample flights
- Liquibase tracks applied changesets automatically
- Easy rollback and version control of schema changes

### Seed Data Strategy

- 20-30 sample flights covering popular US routes (SFO-JFK, LAX-ORD, BOS-MIA, etc.)
- Mix of airlines (United, Delta, American, Southwest)
- Spread departure times throughout the day
- Mix of nonstop and 1-stop flights
- Realistic pricing ($150-$800 range)

### GraphQL Integration

- `spring-boot-starter-graphql` (Spring Boot's official GraphQL support)
- `@Controller` with `@QueryMapping` and `@MutationMapping` annotations
- Schema file at `src/main/resources/graphql/schema.graphqls`
- Built-in GraphiQL at `/graphiql` for development testing
- No external GraphQL libraries needed - all Spring Boot native

---

## Error Handling & Validation

### Backend Validation

**Search Input Validation:**
- Origin/destination must be valid 3-letter airport codes (uppercase)
- Departure date must be today or future date
- Passengers must be between 1-9
- Return 400 Bad Request with clear error messages for invalid inputs

**Booking Input Validation:**
- Flight ID must exist in database
- Passenger name: required, 2-100 characters
- Email: required, valid email format
- Phone: required, basic format validation (10+ digits)
- Flight must have available seats (even though we don't decrement)

**GraphQL Error Responses:**
- Use GraphQL errors array for validation failures
- `BookingResult` type includes `success` flag and `message` for user-friendly errors
- Example: `{ success: false, booking: null, message: "Flight not found" }`

### Frontend Error Handling

**Apollo Client Error Handling:**
- Network errors: Show "Unable to connect" message with retry button
- GraphQL errors: Extract error messages and display near relevant form fields
- Loading states: Show Material-UI skeleton loaders or progress indicators

**User-Facing Messages:**
- Search errors: "Please enter valid airport codes (e.g., SFO, JFK)"
- No results: "No flights found for this route. Try different dates or airports."
- Booking errors: Display specific message from server response
- Success confirmation: Clear success message with booking reference

**Edge Cases:**
- Empty search results handled gracefully with helpful message
- Invalid flight ID in URL redirects to home page
- Invalid booking reference shows "Booking not found" page
- Duplicate booking reference generation retries until unique

---

## Testing Strategy

### Backend Testing

**Unit Tests (JUnit 5 + Mockito):**
- `FlightServiceTest` - test search logic, sorting, filtering
- `BookingServiceTest` - test booking creation, reference generation uniqueness
- Repository tests using `@DataJpaTest` with H2 in-memory database for fast unit tests
- Mock external dependencies, test business logic in isolation

**Integration Tests (Testcontainers):**
- `@SpringBootTest` with Testcontainers PostgreSQL container
- Real PostgreSQL instance spun up automatically for each test run
- Test GraphQL queries and mutations end-to-end against real database
- Verify Liquibase migrations run correctly against real PostgreSQL
- Test full request/response cycle including validation
- Container cleanup handled automatically after tests complete

**Testcontainers Configuration:**
- Add `testcontainers` and `postgresql` dependencies to Gradle
- Use `@Testcontainers` annotation on integration test classes
- PostgreSQL container configured to match production version
- Database initialized fresh for each test class

**Key Test Scenarios:**
- Search returns correct flights for given route and date
- Search returns empty list when no flights match
- Sorting produces correctly ordered results
- Booking creation generates unique reference
- Invalid input returns proper error messages
- Flight and booking relationships persist correctly in real PostgreSQL

### Frontend Testing

**Component Tests (React Testing Library + Jest):**
- `SearchForm` - form submission, validation, user input
- `FlightCard` - displays flight information correctly
- `PassengerForm` - validation, form state management
- `BookingConfirmation` - displays booking details

**Apollo Client Testing:**
- Use `MockedProvider` to mock GraphQL responses
- Test loading states, error states, success states
- Test component behavior with different query results

**Integration Tests:**
- Test complete user flows (search → select → book → confirm)
- Use `@testing-library/user-event` for realistic interactions
- Mock GraphQL backend responses

**No E2E Tests:**
- Skip Cypress/Playwright for MVP to keep it simple
- Manual testing will cover full flow initially

---

## Development Workflow & Configuration

### Docker Setup

**Docker Compose Structure:**

```yaml
# docker-compose.yml (root of monorepo)
services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: travelapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://database:5432/travelapp
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
    depends_on:
      - database

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_GRAPHQL_URI: http://localhost:8080/graphql
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres-data:
```

**Dockerfiles:**

**Backend Dockerfile:**
```dockerfile
FROM gradle:8-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Frontend Dockerfile (Development):**
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]
```

### Local Development Setup

**Starting the Stack:**
```bash
docker-compose up
```
- Database starts first and initializes
- Backend starts, Liquibase runs migrations automatically
- Frontend starts with hot reload enabled
- All services communicate via Docker network

**Development Workflow:**
- Code changes in frontend trigger HMR automatically (volume mounted)
- Backend changes require rebuild: `docker-compose up --build backend`
- GraphiQL available at `http://localhost:8080/graphiql`
- App accessible at `http://localhost:3000`

### Environment Configuration

**Backend (`application.properties`):**
```
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.liquibase.change-log=classpath:db/changelog/db.changelog-master.yaml
spring.graphql.graphiql.enabled=true
```

**Frontend (`.env`):**
```
VITE_GRAPHQL_URI=${VITE_GRAPHQL_URI}
```

### Production Build

**Production Docker Compose:**
- Separate `docker-compose.prod.yml` file
- Frontend builds static files, backend serves them
- Single container for backend serving both API and static files
- Database uses persistent volume with backup strategy
- Environment variables injected from secrets/config

**Multi-stage Frontend Build for Production:**
```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Copy build to backend static resources during backend build
```

### Database Management

- PostgreSQL data persists in Docker volume
- Liquibase migrations run automatically on backend startup
- Database backups via `pg_dump` from container
- Easy reset: `docker-compose down -v` (destroys volumes)

---

## Dependencies & Build Configuration

### Backend Dependencies (build.gradle)

```gradle
dependencies {
    // Spring Boot Starters
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-graphql'
    implementation 'org.springframework.boot:spring-boot-starter-validation'

    // Database
    implementation 'org.postgresql:postgresql'
    implementation 'org.liquibase:liquibase-core'

    // Development
    developmentOnly 'org.springframework.boot:spring-boot-devtools'

    // Testing
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.graphql:spring-graphql-test'
    testImplementation 'org.testcontainers:testcontainers'
    testImplementation 'org.testcontainers:postgresql'
    testImplementation 'org.testcontainers:junit-jupiter'
    testRuntimeOnly 'com.h2database:h2' // for fast unit tests
}
```

### Frontend Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@apollo/client": "^3.8.0",
    "graphql": "^16.8.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "vitest": "^1.0.0"
  }
}
```

### Key Build Features

**Backend (Gradle):**
- Spring Boot Gradle plugin handles packaging and running
- Dependency management via Spring Boot BOM
- Testcontainers BOM for consistent test dependency versions
- Liquibase plugin not needed - runs via Spring Boot auto-config

**Frontend (Vite):**
- Fast dev server with HMR
- Optimized production builds with code splitting
- ESLint and Prettier for code quality (optional)
- Vitest for testing (Jest-compatible API, faster execution)

**Version Strategy:**
- Use latest stable versions of all dependencies
- Spring Boot 3.x (requires Java 17+)
- React 18 with concurrent features
- PostgreSQL 15 for database
- Node 18 LTS for frontend builds

---

## Summary & Implementation Scope

### What's In Scope (MVP Features)

**Core Functionality:**
- Flight search by origin, destination, and departure date
- Display results with airline, times, duration, price, stops, flight number, aircraft
- Sort results by price, duration, or departure time
- Select a flight and proceed to booking
- Collect passenger details (name, email, phone)
- Simulated booking confirmation with generated booking reference
- View booking confirmation page

**Technical Implementation:**
- React frontend with Material-UI components
- Spring Boot backend with GraphQL API
- PostgreSQL database with Liquibase migrations
- 20-30 seeded flight records covering popular routes
- Docker containers for all components
- Unit and integration tests (Testcontainers for backend)
- Development environment with hot reload

### What's Out of Scope (Future Enhancements)

- User authentication and accounts
- Real payment processing
- Return flights / round-trip bookings
- Multi-city bookings
- Advanced filters (price range, specific airlines, time windows)
- Seat selection
- Real-time seat availability updates
- Email confirmations
- Booking cancellation/modification
- Integration with real flight APIs
- Mobile responsive design (can be added easily with MUI)
- Accessibility features (WCAG compliance)
- Analytics and tracking

### Next Steps for Implementation

After design approval, the recommended approach is:
1. Set up git worktree for isolated development (using superpowers:using-git-worktrees)
2. Create detailed implementation plan (using superpowers:writing-plans)
3. Execute implementation in phases:
   - Phase 1: Backend skeleton + database setup
   - Phase 2: GraphQL API implementation
   - Phase 3: Frontend components
   - Phase 4: Integration and testing
   - Phase 5: Docker configuration

### Estimated Complexity

- Backend: ~15-20 Java classes/interfaces
- Frontend: ~10-12 React components
- Database: 2 tables with Liquibase migrations
- Docker: 3 containers with compose configuration
