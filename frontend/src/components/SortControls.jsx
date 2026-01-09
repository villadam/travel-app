import React from 'react'
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

function SortControls({ sortBy, onSortChange }) {
  return (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          value={sortBy}
          label="Sort by"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <MenuItem value="departureTime">Departure Time</MenuItem>
          <MenuItem value="price">Price (Low to High)</MenuItem>
          <MenuItem value="duration">Duration (Shortest)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default SortControls
