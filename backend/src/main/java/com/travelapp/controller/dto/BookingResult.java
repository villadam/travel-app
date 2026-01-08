package com.travelapp.controller.dto;

import com.travelapp.model.Booking;

public record BookingResult(
    boolean success,
    Booking booking,
    String message
) {
    public static BookingResult success(Booking booking) {
        return new BookingResult(true, booking, "Booking created successfully");
    }

    public static BookingResult failure(String message) {
        return new BookingResult(false, null, message);
    }
}
