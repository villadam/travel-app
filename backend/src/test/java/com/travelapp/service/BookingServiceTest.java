package com.travelapp.service;

import com.travelapp.model.Booking;
import com.travelapp.model.BookingStatus;
import com.travelapp.model.Flight;
import com.travelapp.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private FlightService flightService;

    @InjectMocks
    private BookingService bookingService;

    private Flight flight;

    @BeforeEach
    void setUp() {
        flight = new Flight();
        flight.setId(1L);
        flight.setFlightNumber("UA1234");
        flight.setAirline("United Airlines");
        flight.setOrigin("SFO");
        flight.setDestination("JFK");
        flight.setDepartureTime(LocalDateTime.of(2026, 2, 15, 8, 0));
        flight.setArrivalTime(LocalDateTime.of(2026, 2, 15, 16, 30));
        flight.setDurationMinutes(330);
        flight.setPrice(new BigDecimal("350.00"));
        flight.setStops(0);
        flight.setAircraftType("Boeing 737");
        flight.setAvailableSeats(150);
    }

    @Test
    void createBooking_ValidInput_ReturnsBooking() {
        when(flightService.findById(1L)).thenReturn(Optional.of(flight));
        when(bookingRepository.existsByBookingReference(anyString())).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            return booking;
        });

        Booking booking = bookingService.createBooking(
            1L,
            "John Doe",
            "john@example.com",
            "1234567890"
        );

        assertThat(booking).isNotNull();
        assertThat(booking.getPassengerName()).isEqualTo("John Doe");
        assertThat(booking.getBookingReference()).hasSize(6);
        assertThat(booking.getStatus()).isEqualTo(BookingStatus.CONFIRMED);
        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    void createBooking_FlightNotFound_ThrowsException() {
        when(flightService.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.createBooking(
            999L,
            "John Doe",
            "john@example.com",
            "1234567890"
        ))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Flight not found");
    }

    @Test
    void createBooking_InvalidEmail_ThrowsException() {
        when(flightService.findById(1L)).thenReturn(Optional.of(flight));

        assertThatThrownBy(() -> bookingService.createBooking(
            1L,
            "John Doe",
            "invalid-email",
            "1234567890"
        ))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Invalid email address");
    }

    @Test
    void createBooking_InvalidPhone_ThrowsException() {
        when(flightService.findById(1L)).thenReturn(Optional.of(flight));

        assertThatThrownBy(() -> bookingService.createBooking(
            1L,
            "John Doe",
            "john@example.com",
            "123"
        ))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Phone number must be 10-20 digits");
    }

    @Test
    void createBooking_NoSeatsAvailable_ThrowsException() {
        flight.setAvailableSeats(0);
        when(flightService.findById(1L)).thenReturn(Optional.of(flight));

        assertThatThrownBy(() -> bookingService.createBooking(
            1L,
            "John Doe",
            "john@example.com",
            "1234567890"
        ))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("No seats available");
    }
}
