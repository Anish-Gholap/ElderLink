import { useParams } from "react-router-dom"; // to get eventId from url
import { useState, useEffect } from "react"; // to fetch and store event details on page load
import { useEventsContext } from "../contexts/EventsContext"; // to get event using eventId

const EventDetails = () => {

  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const { getEvent, joinEvent } = useEventsContext()

  // fetch event
  useEffect(() => {
    getEvent(eventId).then(setEvent)
  }, [eventId, getEvent]) //updates event whenever a new event is clicked on

  if (!event) return <p> Loading .... </p>

  return (
    <>
      <div>
        <h2>{event.title}</h2>
        <p>{event.numAttendees} slots</p>
        <p>{event.location}</p>
        <h4> Details </h4>
        <p> {event.description} </p>
      </div>
      <div>
        <button onClick={() => joinEvent(event.id)}>
          Join event
        </button>
      </div>
    </>
  )

}

export default EventDetails