import { useState, useEffect } from "react"
import EventCard from "../components/EventCard"
import { useEventsContext } from "../contexts/EventsContext"
import { useNavigate } from "react-router-dom"
import {
  Typography,
  TextField, Button,
  Dialog, DialogContent, DialogActions, DialogTitle,
  Box,
  Autocomplete
} from "@mui/material"
import listOfCCs from "../assets/listOfCCs";
import { CiFilter } from "react-icons/ci"
import { FaPen } from "react-icons/fa"

const EventDiscovery = () => {
  const { allEvents } = useEventsContext()

  const [searchTerm, setSearchTerm] = useState("")
  const [searchDate, setSearchDate] = useState("")
  const [communityClub, setCommunityClub] = useState("")
  const [searchResults, setSearchResults] = useState(null)

  const [userLat, setUserLat] = useState(null)
  const [userLong, setUserLong] = useState(null)

  const [showSearchDialog, setShowSearchDialog] = useState(false)

  const navigate = useNavigate()

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

  // If the community club changes from the front page, we immediately search
  useEffect(() => {
    if (!communityClub || !showSearchDialog) return;
    handleSearch()
  }, [communityClub])

  const handleSearch = async (e = { preventDefault: () => { } }) => {
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
      <Typography textAlign='center' fontWeight={700} variant="h4">Discover Events</Typography>

      {/* Show user's coordinates */}
      {userLat && userLong ? (
        <p>Your location: {userLat.toFixed(5)}, {userLong.toFixed(5)}</p>
      ) : (
        <p>Getting your location...</p>
      )}

      {/* Search Form */}
      <Box my={3} >
        <Typography variant="h5" textAlign='center' fontWeight={600}>Find an event!</Typography>
        <Box display="flex" justifyContent="space-between" gap={2} my={2}>
          <Autocomplete
            disablePortal
            fullWidth
            options={listOfCCs}
            renderInput={(params) => <TextField
              {...params}
              label="CC location"
            />}
            onChange={(event, value) => { setCommunityClub(value) }}
          />
          <CiFilter style={{
            fontSize: "3rem",
            cursor: "pointer",
          }} onClick={() => setShowSearchDialog(true)} />

        </Box>
      </Box>
      <Button sx={{ mb: 3 }} variant="contained" color="info" fullWidth onClick={() => navigate("/create-event")}>
        {"Create Event"} <Box sx={{ml:1}}><FaPen/> </Box>
      </Button>
      <Dialog open={showSearchDialog} onClose={() => setShowSearchDialog(false)}>
        <Box mx={5} mt={4}>
          <Typography variant="h4" >Search Events</Typography>
        </Box>
        <DialogContent>
          <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "2rem", padding: "1rem" }}>
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
            <Autocomplete
              disablePortal
              options={listOfCCs}
              renderInput={(params) => <TextField
                {...params}
                label="CC location"
              />}
            />
          </form>
        </DialogContent>
        <DialogActions style={{ padding: "1rem", display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ mr: 5 }}>
            <Button sx={{ mr: 2 }} type="submit" variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
            <Button type="button" variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          </Box>
          <Button color='primary' onClick={() => setShowSearchDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Cards */}
      {eventsToDisplay && eventsToDisplay.length > 0 ? (
        eventsToDisplay.map(event => (
          <EventCard event={event} key={event.id} />
        ))
      ) : (
        <p>No events found.</p>
      )}


    </>
  )
}

export default EventDiscovery
