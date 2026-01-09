import React from 'react'
import { Paper, Typography, Box, Divider } from '@mui/material'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'

function FlightSummary({ flight }) {
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
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

  const departure = formatDateTime(flight.departureTime)
  const arrival = formatDateTime(flight.arrivalTime)

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Flight Summary
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          {flight.airline}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Flight {flight.flightNumber} • {flight.aircraftType}
        </Typography>

        <Box sx={{ my: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <FlightTakeoffIcon sx={{ mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {departure.time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {departure.date}
              </Typography>
              <Typography variant="body1">
                {flight.origin}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ ml: 5, mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {formatDuration(flight.durationMinutes)} •{' '}
              {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <FlightLandIcon sx={{ mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {arrival.time}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {arrival.date}
              </Typography>
              <Typography variant="body1">
                {flight.destination}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Total Price</Typography>
          <Typography variant="h4" color="primary">
            ${flight.price}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default FlightSummary
