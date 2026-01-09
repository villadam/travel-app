import { gql } from '@apollo/client'

export const SEARCH_FLIGHTS = gql`
  query SearchFlights($origin: String!, $destination: String!, $departureDate: String!, $passengers: Int) {
    searchFlights(origin: $origin, destination: $destination, departureDate: $departureDate, passengers: $passengers) {
      id
      flightNumber
      airline
      origin
      destination
      departureTime
      arrivalTime
      durationMinutes
      price
      stops
      aircraftType
      availableSeats
    }
  }
`

export const GET_FLIGHT = gql`
  query GetFlight($id: ID!) {
    flight(id: $id) {
      id
      flightNumber
      airline
      origin
      destination
      departureTime
      arrivalTime
      durationMinutes
      price
      stops
      aircraftType
      availableSeats
    }
  }
`

export const GET_BOOKING = gql`
  query GetBooking($bookingReference: String!) {
    booking(bookingReference: $bookingReference) {
      id
      bookingReference
      passengerName
      passengerEmail
      passengerPhone
      bookingDate
      status
      flight {
        id
        flightNumber
        airline
        origin
        destination
        departureTime
        arrivalTime
        price
      }
    }
  }
`
