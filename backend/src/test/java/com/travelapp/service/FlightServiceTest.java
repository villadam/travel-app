package com.travelapp.service;

import com.travelapp.model.Flight;
import com.travelapp.repository.FlightRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlightServiceTest {

    @Mock
    private FlightRepository flightRepository;

    @InjectMocks
    private FlightService flightService;

    private Flight flight1;
    private Flight flight2;

    @BeforeEach
    void setUp() {
        flight1 = createFlight(1L, "UA1234", new BigDecimal("350.00"), 330,
                              LocalDateTime.of(2026, 2, 15, 8, 0));
        flight2 = createFlight(2L, "DL5678", new BigDecimal("325.00"), 330,
                              LocalDateTime.of(2026, 2, 15, 10, 30));
    }

    @Test
    void searchFlights_ValidInput_ReturnsFlights() {
        when(flightRepository.searchFlights(anyString(), anyString(), any(LocalDateTime.class)))
            .thenReturn(Arrays.asList(flight1, flight2));

        List<Flight> results = flightService.searchFlights("SFO", "JFK", "2026-02-15");

        assertThat(results).hasSize(2);
        verify(flightRepository).searchFlights(eq("SFO"), eq("JFK"), any(LocalDateTime.class));
    }

    @Test
    void searchFlights_InvalidAirportCode_ThrowsException() {
        assertThatThrownBy(() -> flightService.searchFlights("SFOX", "JFK", "2026-02-15"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Airport code must be exactly 3 letters");
    }

    @Test
    void searchFlights_PastDate_ThrowsException() {
        assertThatThrownBy(() -> flightService.searchFlights("SFO", "JFK", "2020-01-01"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Departure date must be today or in the future");
    }

    @Test
    void sortFlightsByPrice_ReturnsCorrectOrder() {
        List<Flight> flights = Arrays.asList(flight1, flight2);

        List<Flight> sorted = flightService.sortFlightsByPrice(flights);

        assertThat(sorted.get(0).getPrice()).isLessThan(sorted.get(1).getPrice());
    }

    @Test
    void sortFlightsByDuration_ReturnsCorrectOrder() {
        flight2.setDurationMinutes(300);
        List<Flight> flights = Arrays.asList(flight1, flight2);

        List<Flight> sorted = flightService.sortFlightsByDuration(flights);

        assertThat(sorted.get(0).getDurationMinutes()).isLessThan(sorted.get(1).getDurationMinutes());
    }

    private Flight createFlight(Long id, String flightNumber, BigDecimal price,
                               Integer duration, LocalDateTime departureTime) {
        Flight flight = new Flight();
        flight.setId(id);
        flight.setFlightNumber(flightNumber);
        flight.setAirline("Test Airlines");
        flight.setOrigin("SFO");
        flight.setDestination("JFK");
        flight.setDepartureTime(departureTime);
        flight.setArrivalTime(departureTime.plusMinutes(duration));
        flight.setDurationMinutes(duration);
        flight.setPrice(price);
        flight.setStops(0);
        flight.setAircraftType("Boeing 737");
        flight.setAvailableSeats(150);
        return flight;
    }
}
