import React, { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Container, Typography, Box } from '@mui/material'
import SearchForm from '../components/SearchForm'
import FlightResults from '../components/FlightResults'
import { SEARCH_FLIGHTS } from '../graphql/queries'

function SearchPage() {
  const [searchFlights, { loading, error, data }] = useLazyQuery(SEARCH_FLIGHTS)
  const [searched, setSearched] = useState(false)

  const handleSearch = (searchParams) => {
    searchFlights({
      variables: searchParams
    })
    setSearched(true)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Find Your Flight
      </Typography>

      <SearchForm onSearch={handleSearch} loading={loading} />

      {searched && (
        <FlightResults
          flights={data?.searchFlights}
          loading={loading}
          error={error}
        />
      )}
    </Container>
  )
}

export default SearchPage
