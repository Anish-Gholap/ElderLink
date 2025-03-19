import EventCard from "../components/EventCard"
import {useEventsContext} from "../contexts/EventsContext"
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
  const {allEvents} = useEventsContext()

  return (
    <>
      {allEvents.map(event => 
        <EventCard event={event} key={event.id} />
      )}
      <CreateEventButton/>
    </>
  )
}

export default EventDiscovery