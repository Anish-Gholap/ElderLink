import React, { useState } from "react"
import EventForm from "../components/EventForm"
import { useEventsContext } from "../contexts/EventsContext"
import { useNavigate } from "react-router-dom"
import { Box, Typography } from "@mui/material"
import { LuPartyPopper } from "react-icons/lu"
import {useSnackbar} from "../hooks/useSnackbar.js"
import SnackbarComponent from "../components/SnackbarComponent.jsx";

const CreateEvent = () => {
  const [eventName, setEventName] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [eventNumAttendees, setEventNumAttendees] = useState("")
  const [eventDescription, setEventDescription] = useState("")

  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [day, setDay] = useState("")
  const [hours, setHours] = useState("")
  const [minutes, setMinutes] = useState("")

  const { addEvent } = useEventsContext()
  const navigate = useNavigate()
  const snackbar = useSnackbar()

  const handleEventCreation = async (event) => {
    event.preventDefault()

    const selectedDate = new Date(
      parseInt(year),
      parseInt(month), // 0-indexed
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    )
    const isoDateString = selectedDate.toISOString()

    const eventData = {
      title: eventName,
      location: eventLocation?.label,
      numAttendees: eventNumAttendees,
      date: isoDateString, // ✅ using "date" instead of "dateTime"
      description: eventDescription
    }

    try {
      await addEvent(eventData)

      // Reset fields
      setEventName("")
      setEventLocation("")
      setEventNumAttendees("")
      setEventDescription("")
      setYear("")
      setMonth("")
      setDay("")
      setHours("")
      setMinutes("")

      // console.log("Event to add:", eventData)
      // navigate('/event-discovery')
      snackbar.showSuccess("Event successfully created", "/event-discovery")

    } catch (exception) {
      console.log(exception)
      snackbar.showError(exception)
    }
  }

  const handleCancel = (event) => {
    event.preventDefault()
    setEventName("")
    setEventLocation("")
    setEventNumAttendees("")
    setEventDescription("")
    setYear("")
    setMonth("")
    setDay("")
    setHours("")
    setMinutes("")
    navigate('/event-discovery')
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
        year={year}
        month={month}
        day={day}
        hours={hours}
        minutes={minutes}
        handleEventNameChange={({ target }) => setEventName(target.value)}
        handleEventLocationChange={(newValue) => setEventLocation(newValue)}
        handleEventNumAttendeesChange={({ target }) => setEventNumAttendees(target.value)}
        handleEventDescriptionChange={({ target }) => setEventDescription(target.value)}
        handleYearChange={({ target }) => setYear(target.value)}
        handleMonthChange={({ target }) => setMonth(target.value)}
        handleDayChange={({ target }) => setDay(target.value)}
        handleHoursChange={({ target }) => setHours(target.value)}
        handleMinutesChange={({ target }) => setMinutes(target.value)}
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
