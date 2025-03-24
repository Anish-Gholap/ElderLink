import { useState, useEffect } from "react"
import EventCard from "../components/EventCard"
import { useEventsContext } from "../contexts/EventsContext"
import { useNavigate } from "react-router-dom"

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

  // 📍 Get user location and load nearby events on first load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        console.log("📍 Got user location:", latitude, longitude)

        const params = new URLSearchParams()
        params.append("lat", latitude)
        params.append("long", longitude)

        try {
          const res = await fetch(`http://localhost:3002/api/search?${params.toString()}`)
          const data = await res.json()
          console.log("✅ Events near user:", data)
          setSearchResults(data)
        } catch (err) {
          console.error("❌ Error fetching nearby events", err)
        }
      },
      (error) => {
        console.error("❌ Failed to get user location", error)
      }
    )
  }, [])

  // 🔍 Manual search form
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
      <h1>Discover Events</h1>

      {/* 🔍 Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Event Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Community Club"
          value={communityClub}
          onChange={(e) => setCommunityClub(e.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>

      {/* 🗂 Event Cards */}
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
