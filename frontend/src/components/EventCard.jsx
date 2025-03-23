import "../css/eventcard.css"
import { Link } from "react-router-dom"

const EventCard = ({ event }) => {
  return (
    <Link to={`/events/${event.id}`} className="event-card-link">
      <div className="event-card">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-location">{event.location}</p>
        <p className="event-datetime">{event.date}</p> 
      </div>
    </Link>
  )
}

export default EventCard
