import React, { useState } from 'react'
import { Paper, Typography, TextField, Button, Box, Alert } from '@mui/material'

function PassengerForm({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerPhone: ''
  })

  const [validationErrors, setValidationErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validate = () => {
    const errors = {}

    if (!formData.passengerName.trim() || formData.passengerName.trim().length < 2) {
      errors.passengerName = 'Name must be at least 2 characters'
    }

    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/
    if (!formData.passengerEmail || !emailRegex.test(formData.passengerEmail)) {
      errors.passengerEmail = 'Please enter a valid email address'
    }

    const phoneRegex = /^[0-9]{10,20}$/
    const cleanPhone = formData.passengerPhone.replace(/\D/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      errors.passengerPhone = 'Phone number must be 10-20 digits'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      // Clean phone number before submitting
      const cleanPhone = formData.passengerPhone.replace(/\D/g, '')
      onSubmit({
        ...formData,
        passengerPhone: cleanPhone
      })
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Passenger Information
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Full Name"
          name="passengerName"
          value={formData.passengerName}
          onChange={handleChange}
          error={!!validationErrors.passengerName}
          helperText={validationErrors.passengerName}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Email Address"
          name="passengerEmail"
          type="email"
          value={formData.passengerEmail}
          onChange={handleChange}
          error={!!validationErrors.passengerEmail}
          helperText={validationErrors.passengerEmail}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Phone Number"
          name="passengerPhone"
          value={formData.passengerPhone}
          onChange={handleChange}
          error={!!validationErrors.passengerPhone}
          helperText={validationErrors.passengerPhone || 'Enter 10-20 digits'}
          required
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </Button>
      </Box>
    </Paper>
  )
}

export default PassengerForm
