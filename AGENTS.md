# Repository Guidelines

## Project Structure & Module Organization
- `backend/` is the Spring Boot + GraphQL service. Source lives in `backend/src/main/java/com/travelapp`, resources in `backend/src/main/resources`, and tests in `backend/src/test`.
- `frontend/` is the React + Vite app. UI lives in `frontend/src/components` and `frontend/src/pages`, with GraphQL operations in `frontend/src/graphql`.
- `docs/` holds product/design notes.
- `docker-compose.yml` runs the full stack with PostgreSQL.

## Build, Test, and Development Commands
- `docker-compose up -d`: start backend, frontend, and database containers.
- `cd backend && ./gradlew bootRun`: run the API locally.
- `cd backend && ./gradlew test`: run JUnit 5 tests (uses Testcontainers for some integration tests).
- `cd backend && ./gradlew bootJar`: build the backend JAR.
- `cd frontend && npm install`: install frontend dependencies.
- `cd frontend && npm run dev`: start the Vite dev server.
- `cd frontend && npm run build`: build the production frontend bundle.
- `cd frontend && npm run preview`: preview the production build.

## Coding Style & Naming Conventions
- Java uses 4-space indentation; keep package naming under `com.travelapp`.
- React code uses 2-space indentation; prefer PascalCase for components and camelCase for hooks/utilities.
- GraphQL operations live in `frontend/src/graphql` and should match server schema names (`searchFlights`, `createBooking`).
- No formatter is enforced; keep changes aligned with existing file formatting.

## Testing Guidelines
- Backend: JUnit 5 with Spring Boot test support; integration tests may require Docker via Testcontainers.
- Frontend: Vitest + Testing Library (scripts defined, coverage not enforced yet).
- Name tests by class/function intent (e.g., `FlightServiceTest`, `SearchPage.test.jsx`).

## Commit & Pull Request Guidelines
- Commits follow Conventional Commits (e.g., `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`).
- PRs should include a concise summary, testing notes (commands run), and screenshots for UI changes.
- Link relevant issues or docs and call out any config/env updates (see `.env.example`).

## Configuration & Environment Tips
- Use `.env.example` as the baseline for local configuration.
- Backend expects `SPRING_DATASOURCE_*` values when running outside Docker; frontend reads `VITE_GRAPHQL_URI`.
