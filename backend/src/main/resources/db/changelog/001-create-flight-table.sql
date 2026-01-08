--liquibase formatted sql

--changeset travelapp:001-create-flight-table
CREATE TABLE flight (
    id BIGSERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    airline VARCHAR(100) NOT NULL,
    origin VARCHAR(3) NOT NULL,
    destination VARCHAR(3) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stops INTEGER NOT NULL,
    aircraft_type VARCHAR(50) NOT NULL,
    available_seats INTEGER NOT NULL,
    CONSTRAINT chk_airport_codes CHECK (
        origin ~ '^[A-Z]{3}$' AND destination ~ '^[A-Z]{3}$'
    ),
    CONSTRAINT chk_positive_values CHECK (
        duration_minutes > 0 AND
        price > 0 AND
        stops >= 0 AND
        available_seats >= 0
    )
);

CREATE INDEX idx_flight_route ON flight(origin, destination);
CREATE INDEX idx_flight_departure ON flight(departure_time);

--rollback DROP TABLE flight;
