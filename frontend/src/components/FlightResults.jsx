import React, { useState, useMemo } from 'react'
import { Box, Typography, Alert } from '@mui/material'
import SortControls from './SortControls'
import FlightCard from './FlightCard'

function FlightResults({ flights, loading, error }) {
  const [sortBy, setSortBy] = useState('departureTime')

  const sortedFlights = useMemo(() => {
    if (!flights) return []

    const flightsCopy = [...flights]

    switch (sortBy) {
      case 'price':
        return flightsCopy.sort((a, b) => a.price - b.price)
      case 'duration':
        return flightsCopy.sort((a, b) => a.durationMinutes - b.durationMinutes)
      case 'departureTime':
      default:
        return flightsCopy.sort((a, b) =>
          new Date(a.departureTime) - new Date(b.departureTime)
        )
    }
  }, [flights, sortBy])

  if (loading) {
    return (
      <Typography variant="body1" color="text.secondary">
        Searching for flights...
      </Typography>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading flights: {error.message}
      </Alert>
    )
  }

  if (!flights || flights.length === 0) {
    return (
      <Alert severity="info">
        No flights found for this route. Try different dates or airports.
      </Alert>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          {flights.length} flight{flights.length !== 1 ? 's' : ''} found
        </Typography>
        <SortControls sortBy={sortBy} onSortChange={setSortBy} />
      </Box>

      {sortedFlights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </Box>
  )
}

export default FlightResults
