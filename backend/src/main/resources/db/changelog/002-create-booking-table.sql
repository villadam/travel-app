--liquibase formatted sql

--changeset travelapp:002-create-booking-table
CREATE TABLE booking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flight_id BIGINT NOT NULL,
    booking_reference VARCHAR(6) NOT NULL UNIQUE,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(255) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT fk_booking_flight FOREIGN KEY (flight_id) REFERENCES flight(id),
    CONSTRAINT chk_status CHECK (status IN ('CONFIRMED', 'CANCELLED'))
);

CREATE INDEX idx_booking_reference ON booking(booking_reference);
CREATE INDEX idx_booking_flight ON booking(flight_id);

--rollback DROP TABLE booking;
