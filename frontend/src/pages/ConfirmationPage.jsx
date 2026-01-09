import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Button,
  Divider,
  Chip
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import { GET_BOOKING } from '../graphql/queries'

function ConfirmationPage() {
  const { bookingReference } = useParams()
  const navigate = useNavigate()

  const { loading, error, data } = useQuery(GET_BOOKING, {
    variables: { bookingReference }
  })

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error || !data?.getBooking) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Unable to find booking. Please check your booking reference and try again.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Search
        </Button>
      </Container>
    )
  }

  const { booking } = data.getBooking
  const flight = booking.flight
  const departure = formatDateTime(flight.departureTime)
  const arrival = formatDateTime(flight.arrivalTime)

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Success Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 3, textAlign: 'center', bgcolor: 'success.light' }}>
        <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Booking Confirmed!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your flight has been successfully booked. A confirmation email has been sent to {booking.passengerEmail}.
        </Typography>
      </Paper>

      {/* Booking Reference */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <ConfirmationNumberIcon color="primary" />
          <Typography variant="h6">
            Booking Reference:
          </Typography>
          <Chip
            label={booking.bookingReference}
            color="primary"
            size="medium"
            sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
          />
        </Box>
      </Paper>

      {/* Passenger Information */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Passenger Information
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <PersonIcon color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1">
              {booking.passengerName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <EmailIcon color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {booking.passengerEmail}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PhoneIcon color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body1">
              {booking.passengerPhone}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Flight Details */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Flight Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" color="primary" gutterBottom>
          {flight.airline}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Flight {flight.flightNumber} • {flight.aircraftType}
        </Typography>

        <Box sx={{ my: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
            <FlightTakeoffIcon sx={{ mr: 2, mt: 0.5 }} color="primary" />
            <Box>
              <Typography variant="h6">
                {departure.time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {departure.date}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {flight.origin}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ ml: 5, mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              {formatDuration(flight.durationMinutes)} •{' '}
              {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <FlightLandIcon sx={{ mr: 2, mt: 0.5 }} color="primary" />
            <Box>
              <Typography variant="h6">
                {arrival.time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {arrival.date}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {flight.destination}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Total Paid</Typography>
          <Typography variant="h4" color="primary">
            ${flight.price}
          </Typography>
        </Box>
      </Paper>

      {/* Booking Status */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">
            Booking Status:
          </Typography>
          <Chip
            label={booking.status}
            color={booking.status === 'CONFIRMED' ? 'success' : 'default'}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Booked on {new Date(booking.bookingDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/')}
        >
          Book Another Flight
        </Button>
      </Box>
    </Container>
  )
}

export default ConfirmationPage
