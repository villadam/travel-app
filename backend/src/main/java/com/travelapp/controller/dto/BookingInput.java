package com.travelapp.controller.dto;

public record BookingInput(
    Long flightId,
    String passengerName,
    String passengerEmail,
    String passengerPhone
) {}
