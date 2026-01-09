import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { Container, Typography, Box, Alert, CircularProgress, Grid } from '@mui/material'
import FlightSummary from '../components/FlightSummary'
import PassengerForm from '../components/PassengerForm'
import { GET_FLIGHT } from '../graphql/queries'
import { CREATE_BOOKING } from '../graphql/mutations'

function BookingPage() {
  const { flightId } = useParams()
  const navigate = useNavigate()

  const { loading: flightLoading, error: flightError, data: flightData } = useQuery(GET_FLIGHT, {
    variables: { id: flightId }
  })

  const [createBooking, { loading: bookingLoading, error: bookingError }] = useMutation(CREATE_BOOKING)

  const handleBookingSubmit = async (passengerData) => {
    try {
      const { data } = await createBooking({
        variables: {
          input: {
            flightId: parseInt(flightId),
            ...passengerData
          }
        }
      })

      if (data.createBooking.success) {
        navigate(`/confirmation/${data.createBooking.booking.bookingReference}`)
      }
    } catch (err) {
      console.error('Booking error:', err)
    }
  }

  if (flightLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (flightError || !flightData?.flight) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Flight not found. Please return to search and try again.
        </Alert>
      </Container>
    )
  }

  const bookingErrorMessage = bookingError?.message ||
    (bookingError?.graphQLErrors?.[0]?.message)

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Complete Your Booking
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={5}>
          <FlightSummary flight={flightData.flight} />
        </Grid>
        <Grid item xs={12} md={7}>
          <PassengerForm
            onSubmit={handleBookingSubmit}
            loading={bookingLoading}
            error={bookingErrorMessage}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default BookingPage
