package com.travelapp.controller;

import com.travelapp.model.Flight;
import com.travelapp.service.FlightService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @QueryMapping
    public List<Flight> searchFlights(
        @Argument String origin,
        @Argument String destination,
        @Argument String departureDate,
        @Argument Integer passengers
    ) {
        return flightService.searchFlights(origin, destination, departureDate);
    }

    @QueryMapping
    public Flight flight(@Argument Long id) {
        return flightService.findById(id).orElse(null);
    }
}
