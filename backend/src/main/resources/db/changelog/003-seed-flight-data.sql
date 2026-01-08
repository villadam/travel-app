--liquibase formatted sql

--changeset travelapp:003-seed-flight-data
-- SFO to JFK flights
INSERT INTO flight (flight_number, airline, origin, destination, departure_time, arrival_time, duration_minutes, price, stops, aircraft_type, available_seats) VALUES
('UA1234', 'United Airlines', 'SFO', 'JFK', '2026-02-15 08:00:00', '2026-02-15 16:30:00', 330, 350.00, 0, 'Boeing 737', 150),
('DL5678', 'Delta Air Lines', 'SFO', 'JFK', '2026-02-15 10:30:00', '2026-02-15 19:00:00', 330, 325.00, 0, 'Airbus A320', 180),
('AA9012', 'American Airlines', 'SFO', 'JFK', '2026-02-15 14:00:00', '2026-02-15 22:30:00', 330, 375.00, 0, 'Boeing 777', 200),
('UA2345', 'United Airlines', 'SFO', 'JFK', '2026-02-15 06:00:00', '2026-02-15 17:15:00', 435, 280.00, 1, 'Boeing 737', 150),
('DL6789', 'Delta Air Lines', 'SFO', 'JFK', '2026-02-15 12:00:00', '2026-02-15 23:30:00', 450, 265.00, 1, 'Airbus A320', 180);

-- LAX to ORD flights
INSERT INTO flight (flight_number, airline, origin, destination, departure_time, arrival_time, duration_minutes, price, stops, aircraft_type, available_seats) VALUES
('UA3456', 'United Airlines', 'LAX', 'ORD', '2026-02-15 07:00:00', '2026-02-15 13:00:00', 240, 220.00, 0, 'Boeing 737', 150),
('AA0123', 'American Airlines', 'LAX', 'ORD', '2026-02-15 09:30:00', '2026-02-15 15:30:00', 240, 235.00, 0, 'Boeing 777', 200),
('SW4567', 'Southwest Airlines', 'LAX', 'ORD', '2026-02-15 11:00:00', '2026-02-15 17:00:00', 240, 195.00, 0, 'Boeing 737', 175),
('UA4567', 'United Airlines', 'LAX', 'ORD', '2026-02-15 13:00:00', '2026-02-15 21:30:00', 330, 180.00, 1, 'Boeing 737', 150);

-- BOS to MIA flights
INSERT INTO flight (flight_number, airline, origin, destination, departure_time, arrival_time, duration_minutes, price, stops, aircraft_type, available_seats) VALUES
('DL7890', 'Delta Air Lines', 'BOS', 'MIA', '2026-02-15 08:00:00', '2026-02-15 11:30:00', 210, 250.00, 0, 'Airbus A320', 180),
('AA1234', 'American Airlines', 'BOS', 'MIA', '2026-02-15 10:00:00', '2026-02-15 13:30:00', 210, 265.00, 0, 'Boeing 737', 150),
('DL8901', 'Delta Air Lines', 'BOS', 'MIA', '2026-02-15 14:00:00', '2026-02-15 17:30:00', 210, 245.00, 0, 'Airbus A320', 180),
('AA2345', 'American Airlines', 'BOS', 'MIA', '2026-02-15 06:30:00', '2026-02-15 12:45:00', 255, 210.00, 1, 'Boeing 737', 150);

-- SEA to ATL flights
INSERT INTO flight (flight_number, airline, origin, destination, departure_time, arrival_time, duration_minutes, price, stops, aircraft_type, available_seats) VALUES
('DL9012', 'Delta Air Lines', 'SEA', 'ATL', '2026-02-15 07:00:00', '2026-02-15 14:30:00', 270, 320.00, 0, 'Airbus A320', 180),
('AA3456', 'American Airlines', 'SEA', 'ATL', '2026-02-15 09:30:00', '2026-02-15 17:00:00', 270, 310.00, 0, 'Boeing 777', 200),
('DL0123', 'Delta Air Lines', 'SEA', 'ATL', '2026-02-15 12:00:00', '2026-02-15 19:30:00', 270, 335.00, 0, 'Airbus A320', 180),
('AA4567', 'American Airlines', 'SEA', 'ATL', '2026-02-15 10:00:00', '2026-02-15 20:15:00', 375, 275.00, 1, 'Boeing 737', 150);

-- DEN to DFW flights
INSERT INTO flight (flight_number, airline, origin, destination, departure_time, arrival_time, duration_minutes, price, stops, aircraft_type, available_seats) VALUES
('UA5678', 'United Airlines', 'DEN', 'DFW', '2026-02-15 08:00:00', '2026-02-15 10:30:00', 150, 180.00, 0, 'Boeing 737', 150),
('AA5678', 'American Airlines', 'DEN', 'DFW', '2026-02-15 11:00:00', '2026-02-15 13:30:00', 150, 195.00, 0, 'Boeing 777', 200),
('SW5678', 'Southwest Airlines', 'DEN', 'DFW', '2026-02-15 13:30:00', '2026-02-15 16:00:00', 150, 165.00, 0, 'Boeing 737', 175),
('UA6789', 'United Airlines', 'DEN', 'DFW', '2026-02-15 15:00:00', '2026-02-15 17:30:00', 150, 175.00, 0, 'Boeing 737', 150);

-- PHX to LAS flights
INSERT INTO flight (flight_number, airline, origin, destination, departure_time, arrival_time, duration_minutes, price, stops, aircraft_type, available_seats) VALUES
('SW6789', 'Southwest Airlines', 'PHX', 'LAS', '2026-02-15 09:00:00', '2026-02-15 10:15:00', 75, 120.00, 0, 'Boeing 737', 175),
('AA6789', 'American Airlines', 'PHX', 'LAS', '2026-02-15 11:30:00', '2026-02-15 12:45:00', 75, 135.00, 0, 'Boeing 737', 150),
('SW7890', 'Southwest Airlines', 'PHX', 'LAS', '2026-02-15 14:00:00', '2026-02-15 15:15:00', 75, 115.00, 0, 'Boeing 737', 175),
('AA7890', 'American Airlines', 'PHX', 'LAS', '2026-02-15 16:30:00', '2026-02-15 17:45:00', 75, 130.00, 0, 'Boeing 737', 150);

-- Return flights (various routes)
INSERT INTO flight (flight_number, airline, origin, destination, departure_time, arrival_time, duration_minutes, price, stops, aircraft_type, available_seats) VALUES
('UA7890', 'United Airlines', 'JFK', 'SFO', '2026-02-16 08:00:00', '2026-02-16 11:30:00', 390, 365.00, 0, 'Boeing 737', 150),
('DL1234', 'Delta Air Lines', 'ORD', 'LAX', '2026-02-16 09:00:00', '2026-02-16 11:30:00', 270, 230.00, 0, 'Airbus A320', 180),
('AA8901', 'American Airlines', 'MIA', 'BOS', '2026-02-16 10:00:00', '2026-02-16 13:30:00', 210, 260.00, 0, 'Boeing 737', 150);

--rollback DELETE FROM flight;
