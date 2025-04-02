import { useState, useEffect } from "react"
import EventCard from "../components/EventCard"
import { useEventsContext } from "../contexts/EventsContext"
import { useNavigate } from "react-router-dom"
import {
  Typography,
  TextField, Button,
  Box,
  InputAdornment
} from "@mui/material"
import { CiSearch } from "react-icons/ci"
import { FaPen } from "react-icons/fa"

const EventDiscovery = () => {
  const { allEvents, updateUserLocation } = useEventsContext()

  // Single search query
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)

  // User location
  const [userLat, setUserLat] = useState(null)
  const [userLong, setUserLong] = useState(null)

  const navigate = useNavigate()

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          updateUserLocation(latitude, longitude);
        },
        (error) => {
          console.error("❌ Failed to get user location", error)
        }
    )

  }, [])

  // Handle search with debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        handleSearch()
      } else {
        setSearchResults(null) // Reset to show all events
      }
    }, 500)

    return () => clearTimeout(delaySearch)
  }, [searchQuery])

  const handleSearch = async () => {
    const params = new URLSearchParams()

    // Add search term parameter for event title only
    if (searchQuery) params.append("searchTerm", searchQuery)

    // Note: We're only searching by event title, not by community club

    // // Include location if available
    // if (userLat && userLong) {
    //   params.append("lat", userLat)
    //   params.append("long", userLong)
    // }

    try {
      const res = await fetch(`http://localhost:3002/api/search?${params.toString()}`)
      const data = await res.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Error fetching search results:", error)
    }
  }

  const handleReset = () => {
    setSearchQuery("")
    setSearchResults(null)
  }

  const eventsToDisplay = searchResults !== null ? searchResults : allEvents

  return (
      <>
        <Typography textAlign='center' fontWeight={700} variant="h4" mb={3}>Discover Events</Typography>

        {/* Main Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
              fullWidth
              placeholder="Search events by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <CiSearch size={24} />
                    </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <Button size="small" onClick={handleReset}>
                        Clear
                      </Button>
                    </InputAdornment>
                ) : null
              }}
          />
        </Box>

        {/* Create Event Button */}
        <Button
            sx={{ mb: 3 }}
            variant="contained"
            color="info"
            fullWidth
            onClick={() => navigate("/create-event")}
        >
          {"Create Event"} <Box sx={{ml:1}}><FaPen/></Box>
        </Button>

        {/* Location indicator */}
        {userLat && userLong && searchQuery && (
            <Typography variant="caption" display="block" color="text.secondary" mb={2}>
              Results sorted by proximity to your location
            </Typography>
        )}

        {/* Event Cards */}
        {eventsToDisplay && eventsToDisplay.length > 0 ? (
            eventsToDisplay.map(event => (
                <EventCard event={event} key={event._id} />
            ))
        ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6">No events found.</Typography>
              <Typography color="text.secondary">Try adjusting your search terms.</Typography>
            </Box>
        )}
      </>
  )
}

export default EventDiscovery