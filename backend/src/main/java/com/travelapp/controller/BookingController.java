package com.travelapp.controller;

import com.travelapp.controller.dto.BookingInput;
import com.travelapp.controller.dto.BookingResult;
import com.travelapp.model.Booking;
import com.travelapp.service.BookingService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @MutationMapping
    public BookingResult createBooking(@Argument BookingInput input) {
        try {
            Booking booking = bookingService.createBooking(
                input.flightId(),
                input.passengerName(),
                input.passengerEmail(),
                input.passengerPhone()
            );
            return BookingResult.success(booking);
        } catch (IllegalArgumentException e) {
            return BookingResult.failure(e.getMessage());
        } catch (IllegalStateException e) {
            return BookingResult.failure(e.getMessage());
        } catch (Exception e) {
            return BookingResult.failure("An unexpected error occurred");
        }
    }

    @QueryMapping
    public Booking booking(@Argument String bookingReference) {
        return bookingService.findByBookingReference(bookingReference).orElse(null);
    }
}
