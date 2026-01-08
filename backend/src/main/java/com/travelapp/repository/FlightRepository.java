package com.travelapp.repository;

import com.travelapp.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    @Query("SELECT f FROM Flight f WHERE f.origin = :origin AND f.destination = :destination " +
           "AND DATE(f.departureTime) = DATE(:departureDate) ORDER BY f.departureTime")
    List<Flight> searchFlights(@Param("origin") String origin,
                               @Param("destination") String destination,
                               @Param("departureDate") LocalDateTime departureDate);
}
