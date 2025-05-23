import {useEffect, useState} from "react"
import EventCard from "../components/EventCard"
import {useEventsContext} from "../contexts/EventsContext"
import {useNavigate} from "react-router-dom"
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
  Popover,
  FormControlLabel,
  Checkbox,
  Stack,
  Divider,
  CircularProgress
} from "@mui/material"
import {CiSearch} from "react-icons/ci"
import {FaPen} from "react-icons/fa"
import {FiFilter} from "react-icons/fi"
import searchService from "../services/search"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useSnackbar } from "../hooks/useSnackbar"
import SnackbarComponent from "../components/SnackbarComponent"

/**
 * EventDiscovery component for discovering and searching events.
 * Provides a search bar, filters, and displays a list of events.
 * @component
 * @returns {JSX.Element} The EventDiscovery page component.
 */
const EventDiscovery = () => {
  const {allEvents, updateUserLocation, eventSnackbar, loading} = useEventsContext()
  const snackbar = useSnackbar()

  // Single search query
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [filterByClub, setFilterByClub] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [fetchFailed, setFetchFailed] = useState(false)

  // For filter popover
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const navigate = useNavigate()

  /**
   * Fetches the user's location and updates the context.
   * @useEffect
   */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords
        updateUserLocation(latitude, longitude);
        console.log("retrieved user location")
      },
      (error) => {
        console.error("❌ Failed to get user location", error)
        // Still call updateUserLocation with null values to ensure events are fetched
        // This will trigger the fallback in your context
        updateUserLocation(null, null);
      }
    )

    // Cleanup function
    return () => {
      // If needed, you can reset location on unmount
      // updateUserLocation(null, null);
    }
  }, [updateUserLocation]) // Add updateUserLocation to dependencies

  /**
   * Handles search with debounce to optimize API calls.
   * @useEffect
   */
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery || selectedDate) {
        handleSearch()
      } else {
        setSearchResults(null) // Reset to show all events
      }
    }, 500)

    return () => clearTimeout(delaySearch)
  }, [searchQuery, filterByClub, selectedDate]) // Add selectedDate to dependencies

  /**
   * Displays an error message if fetching events fails.
   * @useEffect
   */
  useEffect(() => {
    if (fetchFailed) {
      snackbar.showError("Failed to fetch events. Please try again.")
    }
  }, [fetchFailed])

  /**
   * Handles the search functionality based on query and filters.
   * @async
   */
  const handleSearch = async () => {
    const params = new URLSearchParams()

    // Add search term parameter
    if (searchQuery) {
      if (filterByClub) {
        // When filter is enabled, search in community club names
        params.append("communityClub", searchQuery)
      } else {
        // Otherwise search in event titles
        params.append("searchTerm", searchQuery)
      }
    }

    // Add date filter if selected
    if (selectedDate) {
      // Format date as YYYY-MM-DD
      const formattedDate = selectedDate.format('YYYY-MM-DD')
      params.append("date", formattedDate)
    }

    // Note: We're now searching by event title/community club and optionally by date

    // // Include location if available
    // if (userLat && userLong) {
    //   params.append("lat", userLat)
    //   params.append("long", userLong)
    // }

    try {
      // const res = await fetch(`http://localhost:3002/api/search?${params.toString()}`)
      const res = await searchService.searchEvents(params)
      setSearchResults(res)
      setFetchFailed(false)
    } catch (error) {
      console.error("Error fetching search results:", error)
      setFetchFailed(true)
    }
  }

  /**
   * Resets the search query and filters.
   */
  const handleReset = () => {
    setSearchQuery("")
    setSearchResults(null)
    setFilterByClub(false)
    setSelectedDate(null)
  }
  /**
   * Opens the filter popover.
   * @param {Object} event - The click event.
   */
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  /**
   * Closes the filter popover.
   */
  const handleFilterClose = () => {
    setAnchorEl(null)
  }

  /**
   * Toggles the filter by community club and triggers a search if a query exists.
   */
  const handleFilterChange = () => {
    setFilterByClub(!filterByClub)
    // Trigger search if there's a query
    if (searchQuery) {
      handleSearch()
    }
  }
  /**
   * Updates the selected date and triggers a search.
   * @param {Object} newDate - The selected date.
   */
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate)
    // Search will be triggered by useEffect
  }

  /**
   * Clears the selected date and triggers a search.
   */
  const handleClearDate = () => {
    setSelectedDate(null)
    // Search will be triggered by useEffect if there's a query
    handleSearch()
  }

  const eventsToDisplay = searchResults !== null ? searchResults : allEvents

  return (
    <>
      <Typography textAlign='center' fontWeight={700} variant="h4" mb={3}>Discover Events</Typography>

      {/* Main Search Bar */}
      <Box sx={{mb: 3, display: 'flex', alignItems: 'center'}}>
        <TextField
          fullWidth
          placeholder="Search events by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CiSearch size={24}/>
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
        <IconButton
          onClick={handleFilterClick}
          sx={{ ml: 1 }}
          color={filterByClub || selectedDate ? "primary" : "default"}
          aria-label="Filter options"
        >
          <FiFilter />
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ p: 2, width: '300px' }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Filter Options
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={filterByClub}
                  onChange={handleFilterChange}
                />
              }
              label="Search by Community Club"
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" mb={1}>
              Filter by Date
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction="row" spacing={1} alignItems="center">
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      placeholder: "DD/MM/YYYY"
                    }
                  }}
                />
                {selectedDate && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleClearDate}
                  >
                    Clear
                  </Button>
                )}
              </Stack>
            </LocalizationProvider>
          </Box>
        </Popover>
      </Box>

      {/* Create Event Button */}
      <Button
        sx={{mb: 3}}
        variant="contained"
        color="info"
        fullWidth
        onClick={() => navigate("/create-event")}
      >
        {"Create Event"} <Box sx={{ml: 1}}><FaPen/></Box>
      </Button>

      {/* Show active filters info */}
      <Box sx={{ mb: 2 }}>
        {(filterByClub || selectedDate) && (
          <Typography variant="body2" color="text.secondary">
            Filters active:
            {filterByClub && " Community Club"}
            {filterByClub && selectedDate && ", "}
            {selectedDate && ` Date: ${selectedDate.format('DD-MM-YYYY')}`}
          </Typography>
        )}
      </Box>

      {/* Event Cards */}
      {loading ? (
        <Box sx={{textAlign: 'center', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6">Loading events...</Typography>
        </Box>
      ) : eventsToDisplay && eventsToDisplay.length > 0 ? (
        eventsToDisplay.map(event => (
          <EventCard event={event} key={event.id}/>
        ))
      ) : (
        <Box sx={{textAlign: 'center', py: 4}}>
          <Typography variant="h6">No events found.</Typography>
          <Typography color="text.secondary">Try adjusting your search terms or filters.</Typography>
        </Box>
      )}

      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        autoHideDuration={snackbar.autoHideDuration}
        handleClose={snackbar.handleClose}
      />
      <SnackbarComponent
        open={eventSnackbar.open}
        message={eventSnackbar.message}
        severity={eventSnackbar.severity}
        autoHideDuration={eventSnackbar.autoHideDuration}
        handleClose={eventSnackbar.handleClose}
      />
    </>
  )
}

export default EventDiscovery