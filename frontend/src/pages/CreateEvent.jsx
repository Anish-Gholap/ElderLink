import { useState } from "react"
import EventForm from "../components/EventForm"
import { useEventsContext } from "../contexts/EventsContext"
import { useNavigate } from "react-router-dom"

const CreateEvent = () => {
  const [eventName, setEventName] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [eventNumAttendees, setEventNumAttendees] = useState("")
  const [eventDateTime, setEventDateTime] = useState("")
  const [eventDescription, setEventDescription] = useState("")

  const {addEvent} = useEventsContext()
  const navigate = useNavigate()

  // on form submit
  const handleEventCreation = (event) => {
    event.preventDefault()

    const eventData = {
      title: eventName,
      location: eventLocation,
      numAttendees: eventNumAttendees,
      dateTime: eventDateTime,
      description: eventDescription
    }

    // add event using EventContext
    try {
      addEvent(eventData)
    } catch (exception) {
      console.log(exception)
    }

    // reset input fields
    setEventName("")
    setEventDateTime("")
    setEventDescription("")
    setEventLocation("")
    setEventNumAttendees("")

    console.log("Event to add: ", eventData)

    // navigate back to event discovery page
    navigate('/event-discovery')

  }

  // cancel event creation
  const handleCancel = (event) => {
    event.preventDefault()

    // reset input fields
    setEventName("")
    setEventDateTime("")
    setEventDescription("")
    setEventLocation("")
    setEventNumAttendees("")

    // navigate back to event discovery page
    navigate('/event-discovery')

  }

  return (
    <div>
      <h1> Create Event </h1>
      <EventForm 
        handleSubmit={handleEventCreation}
        handleCancel={handleCancel}
        eventName={eventName}
        eventLocation={eventLocation}
        eventNumAttendees={eventNumAttendees}
        eventDateTime={eventDateTime}
        eventDescription={eventDescription}
        handleEventNameChange={({ target }) => setEventName(target.value)}
        handleEventLocationChange={({ target }) => setEventLocation(target.value)}
        handleEventNumAttendeesChange={({ target }) => setEventNumAttendees(target.value)}
        handleEventDateTimeChange={({ target }) => setEventDateTime(target.value)}
        handleEventDescriptionChange={({ target }) => setEventDescription(target.value)}
      />
    </div>
  )
}

export default CreateEvent