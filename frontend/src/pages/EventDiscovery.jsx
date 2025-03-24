import { useState, useEffect } from "react"
import EventCard from "../components/EventCard"
import { useEventsContext } from "../contexts/EventsContext"
import { useNavigate } from "react-router-dom"
import { Typography, TextField, Button } from "@mui/material"

const CreateEventButton = () => {
  const navigate = useNavigate()
  return (
    <div>
      <button onClick={() => navigate("/create-event")}>
        Create Event
      </button>
    </div>
  )
}

const EventDiscovery = () => {
  const { allEvents } = useEventsContext()

  const [searchTerm, setSearchTerm] = useState("")
  const [searchDate, setSearchDate] = useState("")
  const [communityClub, setCommunityClub] = useState("")
  const [searchResults, setSearchResults] = useState(null)

  const [userLat, setUserLat] = useState(null)
  const [userLong, setUserLong] = useState(null)

  // Get user location (but don't fetch events yet)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        console.log("User location:", latitude, longitude)
        setUserLat(latitude)
        setUserLong(longitude)

        // Ready for use later if needed:
        const params = new URLSearchParams()
        params.append("lat", latitude)
        params.append("long", longitude)
        const searchUrl = `/api/search?${params.toString()}`
        console.log("Prepared request:", searchUrl)

        // Don't send the request yet
      },
      (error) => {
        console.error("❌ Failed to get user location", error)
      }
    )
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (searchTerm) params.append("searchTerm", searchTerm)
    if (searchDate) params.append("date", searchDate)
    if (communityClub) params.append("communityClub", communityClub)

    try {
      const res = await fetch(`http://localhost:3002/api/search?${params.toString()}`)
      const data = await res.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Error fetching search results:", error)
    }
  }

  const handleReset = () => {
    setSearchTerm("")
    setSearchDate("")
    setCommunityClub("")
    setSearchResults(null)
  }

  const eventsToDisplay = searchResults !== null ? searchResults : allEvents

  return (
    <>
      <Typography textAlign='center' variant="h4">Discover Events</Typography>

      {/* Show user's coordinates */}
      {userLat && userLong ? (
        <p>Your location: {userLat.toFixed(5)}, {userLong.toFixed(5)}</p>
      ) : (
        <p>Getting your location...</p>
      )}

      {/* Search Form */}
        <form onSubmit={handleSearch} style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <TextField
            label="Event Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <TextField
            label="Community Club"
            variant="outlined"
            value={communityClub}
            onChange={(e) => setCommunityClub(e.target.value)}
          />
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button type="submit" variant="contained" color="primary">Search</Button>
            <Button type="button" variant="outlined" onClick={handleReset}>Reset</Button>
          </div>
        </form>

        {/* Event Cards */}
      {eventsToDisplay && eventsToDisplay.length > 0 ? (
        eventsToDisplay.map(event => (
          <EventCard event={event} key={event.id} />
        ))
      ) : (
        <p>No events found.</p>
      )}

      <CreateEventButton />
    </>
  )
}

export default EventDiscovery
