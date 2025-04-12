import React, { useState } from "react"
import EventForm from "../components/EventForm"
import { useEventsContext } from "../contexts/EventsContext"
import { useNavigate } from "react-router-dom"
import { Box, Typography } from "@mui/material"
import { LuPartyPopper } from "react-icons/lu"
import { useSnackbar } from "../hooks/useSnackbar.js"
import SnackbarComponent from "../components/SnackbarComponent.jsx"
import dayjs from "dayjs"

/**
 * CreateEvent component for creating a new event.
 * Provides a form for users to input event details and handles event creation logic.
 * @component
 * @returns {JSX.Element} The CreateEvent page component.
 */
const CreateEvent = () => {
  const [eventName, setEventName] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [eventNumAttendees, setEventNumAttendees] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [dateTime, setDateTime] = useState(dayjs()) // Initialize with current date/time

  const { addEvent } = useEventsContext()
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  /**
   * Handles the event creation process.
   * Validates input fields, sends the event data to the backend, and resets the form on success.
   * @async
   * @param {Object} event - The form submission event.
   */
  const handleEventCreation = async (event) => {
    event.preventDefault()

    // Validation checks
    if (!eventName || !eventLocation || !eventNumAttendees || !dateTime || !eventDescription) {
      snackbar.showError("Please fill in all required fields")
      return
    }

    // Get ISO string from dayjs object
    const isoDateString = dateTime.toISOString()

    const eventData = {
      title: eventName,
      location: eventLocation?.label,
      numAttendees: parseInt(eventNumAttendees),
      date: isoDateString,
      description: eventDescription
    }

    try {
      await addEvent(eventData)

      // Reset fields
      setEventName("")
      setEventLocation("")
      setEventNumAttendees("")
      setEventDescription("")
      setDateTime(dayjs())

      snackbar.showSuccess("Event successfully created", "/event-discovery")

    } catch (exception) {
      console.log(exception)
      snackbar.showError(exception)
    }
  }

  /**
   * Handles the cancel action, resetting the form and navigating back to the event discovery page.
   * @param {Object} event - The form submission event.
   */
  const handleCancel = (event) => {
    event.preventDefault()
    setEventName("")
    setEventLocation("")
    setEventNumAttendees("")
    setEventDescription("")
    setDateTime(dayjs())
    navigate('/event-discovery')
  }

  /**
   * Handles changes to the number of attendees input field.
   * Ensures the value is a positive number or empty.
   * @param {Object} target - The input event target.
   */
  const handleEventNumAttendeesChange = ({ target }) => {
    const value = parseInt(target.value)
    if (value >= 1 || target.value === '') {
      setEventNumAttendees(target.value)
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: '#f36f00',
        padding: '15%',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '7%',
        boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <LuPartyPopper fontSize='3rem' />
        <Typography variant="h3" align="center" >
          Create Event
        </Typography>
      </Box>
      <EventForm
        handleSubmit={handleEventCreation}
        handleCancel={handleCancel}
        eventName={eventName}
        eventLocation={eventLocation}
        eventNumAttendees={eventNumAttendees}
        eventDescription={eventDescription}
        dateTime={dateTime}
        handleEventNameChange={({ target }) => setEventName(target.value)}
        handleEventLocationChange={(newValue) => setEventLocation(newValue)}
        handleEventNumAttendeesChange={handleEventNumAttendeesChange}
        handleEventDescriptionChange={({ target }) => setEventDescription(target.value)}
        handleDateTimeChange={(newDateTime) => setDateTime(newDateTime)}
      />
      <SnackbarComponent
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        autoHideDuration={snackbar.autoHideDuration}
        handleClose={snackbar.handleClose}
      />
    </Box>
  )
}

export default CreateEvent