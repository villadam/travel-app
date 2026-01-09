import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material'
import FlightIcon from '@mui/icons-material/Flight'
import client from './apollo/client'
import SearchPage from './pages/SearchPage'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static" elevation={2}>
            <Toolbar>
              <FlightIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Flight Booking App
              </Typography>
            </Toolbar>
          </AppBar>

          <Container component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/book/:flightId" element={<BookingPage />} />
              <Route path="/confirmation/:bookingReference" element={<ConfirmationPage />} />
            </Routes>
          </Container>

          <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper' }}>
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                © {new Date().getFullYear()} Flight Booking App. All rights reserved.
              </Typography>
            </Container>
          </Box>
        </Box>
      </Router>
    </ApolloProvider>
  )
}

export default App
