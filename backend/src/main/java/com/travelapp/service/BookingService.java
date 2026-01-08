package com.travelapp.service;

import com.travelapp.model.Booking;
import com.travelapp.model.BookingStatus;
import com.travelapp.model.Flight;
import com.travelapp.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class BookingService {

    private static final String REFERENCE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int REFERENCE_LENGTH = 6;
    private static final int MAX_GENERATION_ATTEMPTS = 10;

    private final BookingRepository bookingRepository;
    private final FlightService flightService;
    private final SecureRandom random = new SecureRandom();

    public BookingService(BookingRepository bookingRepository, FlightService flightService) {
        this.bookingRepository = bookingRepository;
        this.flightService = flightService;
    }

    public Booking createBooking(Long flightId, String passengerName, String passengerEmail, String passengerPhone) {
        // Validate flight exists
        Flight flight = flightService.findById(flightId)
            .orElseThrow(() -> new IllegalArgumentException("Flight not found: " + flightId));

        // Validate passenger details
        validatePassengerDetails(passengerName, passengerEmail, passengerPhone);

        // Check seat availability (simulated - we don't actually decrement)
        if (flight.getAvailableSeats() <= 0) {
            throw new IllegalStateException("No seats available on this flight");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setFlight(flight);
        booking.setBookingReference(generateUniqueBookingReference());
        booking.setPassengerName(passengerName);
        booking.setPassengerEmail(passengerEmail);
        booking.setPassengerPhone(passengerPhone);
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus(BookingStatus.CONFIRMED);

        return bookingRepository.save(booking);
    }

    @Transactional(readOnly = true)
    public Optional<Booking> findByBookingReference(String bookingReference) {
        return bookingRepository.findByBookingReference(bookingReference);
    }

    private String generateUniqueBookingReference() {
        for (int attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
            String reference = generateBookingReference();
            if (!bookingRepository.existsByBookingReference(reference)) {
                return reference;
            }
        }
        throw new IllegalStateException("Failed to generate unique booking reference after " +
                                       MAX_GENERATION_ATTEMPTS + " attempts");
    }

    private String generateBookingReference() {
        StringBuilder reference = new StringBuilder(REFERENCE_LENGTH);
        for (int i = 0; i < REFERENCE_LENGTH; i++) {
            reference.append(REFERENCE_CHARS.charAt(random.nextInt(REFERENCE_CHARS.length())));
        }
        return reference.toString();
    }

    private void validatePassengerDetails(String name, String email, String phone) {
        if (name == null || name.trim().length() < 2 || name.trim().length() > 100) {
            throw new IllegalArgumentException("Passenger name must be between 2 and 100 characters");
        }
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email address");
        }
        if (phone == null || !phone.matches("^\\+?[0-9]{10,20}$")) {
            throw new IllegalArgumentException("Phone number must be 10-20 digits");
        }
    }
}
