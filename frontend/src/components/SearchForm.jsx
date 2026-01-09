import React, { useState } from 'react'
import { Box, TextField, Button, Paper, Grid } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

function SearchForm({ onSearch, loading }) {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (origin && destination && departureDate) {
      onSearch({
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureDate
      })
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="From"
              placeholder="e.g., SFO"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              inputProps={{ maxLength: 3 }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="To"
              placeholder="e.g., JFK"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              inputProps={{ maxLength: 3 }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Departure Date"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              startIcon={<SearchIcon />}
              sx={{ height: '56px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}

export default SearchForm
