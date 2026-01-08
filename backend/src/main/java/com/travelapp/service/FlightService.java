package com.travelapp.service;

import com.travelapp.model.Flight;
import com.travelapp.repository.FlightRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    public List<Flight> searchFlights(String origin, String destination, String departureDate) {
        validateAirportCode(origin);
        validateAirportCode(destination);

        LocalDateTime date = parseDate(departureDate);
        return flightRepository.searchFlights(
            origin.toUpperCase(),
            destination.toUpperCase(),
            date
        );
    }

    public List<Flight> sortFlightsByPrice(List<Flight> flights) {
        return flights.stream()
            .sorted(Comparator.comparing(Flight::getPrice))
            .toList();
    }

    public List<Flight> sortFlightsByDuration(List<Flight> flights) {
        return flights.stream()
            .sorted(Comparator.comparing(Flight::getDurationMinutes))
            .toList();
    }

    public List<Flight> sortFlightsByDepartureTime(List<Flight> flights) {
        return flights.stream()
            .sorted(Comparator.comparing(Flight::getDepartureTime))
            .toList();
    }

    public Optional<Flight> findById(Long id) {
        return flightRepository.findById(id);
    }

    private void validateAirportCode(String code) {
        if (code == null || !code.matches("^[A-Za-z]{3}$")) {
            throw new IllegalArgumentException("Airport code must be exactly 3 letters: " + code);
        }
    }

    private LocalDateTime parseDate(String dateString) {
        try {
            LocalDate date = LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);
            if (date.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Departure date must be today or in the future");
            }
            return date.atStartOfDay();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Expected: YYYY-MM-DD");
        }
    }
}
