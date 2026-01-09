import { gql } from '@apollo/client'

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      success
      message
      booking {
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
  }
`
