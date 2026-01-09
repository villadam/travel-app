import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Container, Typography } from '@mui/material'
import client from './apollo/client'

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Flight Booking App
          </Typography>
          <Typography variant="body1">
            Frontend coming soon...
          </Typography>
        </Container>
      </Router>
    </ApolloProvider>
  )
}

export default App
