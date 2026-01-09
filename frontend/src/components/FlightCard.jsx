import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Divider
} from '@mui/material'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

function FlightCard({ flight }) {
  const navigate = useNavigate()

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const handleBook = () => {
    navigate(`/book/${flight.id}`)
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="div" gutterBottom>
              {flight.airline}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Flight {flight.flightNumber} • {flight.aircraftType}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FlightTakeoffIcon sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{formatTime(flight.departureTime)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.origin}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Chip
                  icon={<AccessTimeIcon />}
                  label={formatDuration(flight.durationMinutes)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Divider />
                <Typography variant="caption" color="text.secondary">
                  {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 1 }}>
                  <Typography variant="h6">{formatTime(flight.arrivalTime)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.destination}
                  </Typography>
                </Box>
                <FlightLandIcon />
              </Box>
            </Box>
          </Box>

          <Box sx={{ ml: 4, textAlign: 'right' }}>
            <Typography variant="h4" color="primary" gutterBottom>
              ${flight.price}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
              {flight.availableSeats} seats left
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleBook}
              fullWidth
            >
              Book
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default FlightCard
