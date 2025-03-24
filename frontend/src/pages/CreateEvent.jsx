import { useState } from "react"
import EventForm from "../components/EventForm"
import { useEventsContext } from "../contexts/EventsContext"
import { useNavigate } from "react-router-dom"
import { Typography } from "@mui/material"

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

  const handleEventCreation = (event) => {
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
      location: eventLocation,
      numAttendees: eventNumAttendees,
      date: isoDateString, // ✅ using "date" instead of "dateTime"
      description: eventDescription
    }

    try {
      addEvent(eventData)
    } catch (exception) {
      console.log(exception)
    }

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

    console.log("Event to add:", eventData)
    navigate('/event-discovery')
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
    <div>
      <Typography variant="h3" align="center" gutterBottom>
        Create Event
      </Typography>
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
        handleEventLocationChange={({ target }) => setEventLocation(target.value)}
        handleEventNumAttendeesChange={({ target }) => setEventNumAttendees(target.value)}
        handleEventDescriptionChange={({ target }) => setEventDescription(target.value)}
        handleYearChange={({ target }) => setYear(target.value)}
        handleMonthChange={({ target }) => setMonth(target.value)}
        handleDayChange={({ target }) => setDay(target.value)}
        handleHoursChange={({ target }) => setHours(target.value)}
        handleMinutesChange={({ target }) => setMinutes(target.value)}
      />
    </div>
  )
}

export default CreateEvent
