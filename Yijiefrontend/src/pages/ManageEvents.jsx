import { useEventsContext } from "../contexts/EventsContext"
import EventCard from "../components/EventCard"
import { useNavigate } from "react-router-dom"

const CreateEventButton = () => {
  const navigate = useNavigate()

  return (
    <div>
      <button onClick={() => navigate("/create-event")}>
        Add New Event
      </button>
    </div>
  )
}

const ManageEvents = () => {
  const {myEvents, removeEvent} = useEventsContext()
  const navigate = useNavigate()

  const handleDelete = (id) => {
    removeEvent(id).catch(err => console.error(err))
  } 

  return (
    <div>
      <h2> Created By You </h2>
      {myEvents.map(event => {
        return (
          <div key={event.id} style={{ marginBottom: "1rem" }}>
            {console.log("Event id ", event.id)}
            <EventCard event={event} key={event.id} />
            <button onClick={() => navigate(`/events/${event.id}/edit`)}>Edit</button>
            <button onClick={() => handleDelete(event.id)}>Delete</button>
          </div>
        )
      })}
      <CreateEventButton />
    </div>
  )
}

export default ManageEvents