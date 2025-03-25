import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEventsContext } from "../contexts/EventsContext";
import { useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";

const EditEvent = () => {

  const {eventId} = useParams()
  const {getEvent, updateEvent} = useEventsContext()
  const navigate = useNavigate()
  
  const [eventData, setEventData] = useState({
    title: "",
    location: "",
    numAttendees: "",
    date: "",
    description: "",
  })

  useEffect(() => {
    getEvent(eventId).then(setEventData).catch(console.error)
  }, [eventId, getEvent])

  const handleEventEdit = async (event) => {
    event.preventDefault()
  
    try{
      await updateEvent(eventId, eventData)
      navigate("/events-management")
    } catch (error) {
      console.log("Failed to update event:", error)
    }
  }

  // cancel event creation
  const handleCancel = (event) => {
    event.preventDefault()

    // navigate back to event discovery page
    navigate('/events-management')

  }

  return (
    <>
      <div>
        <h1> Edit Event </h1>
        <EventForm 
          handleSubmit={handleEventEdit}
          handleCancel={handleCancel}
          eventName={eventData.title}
          eventLocation={eventData.location}
          eventNumAttendees={eventData.numAttendees}
          eventDateTime={eventData.date}
          eventDescription={eventData.description}
          handleEventNameChange={({ target }) => setEventData({ ...eventData, title: target.value })}
          handleEventLocationChange={({ target }) => setEventData({ ...eventData, location: target.value })}
          handleEventNumAttendeesChange={({ target }) => setEventData({ ...eventData, numAttendees: target.value })}
          handleEventDateTimeChange={({ target }) => setEventData({ ...eventData, date: target.value })}
          handleEventDescriptionChange={({ target }) => setEventData({ ...eventData, description: target.value })}
        />
      </div>
    </>
  )
}

export default EditEvent