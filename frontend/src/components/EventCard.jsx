import "../css/eventcard.css"
import { Link } from "react-router-dom"
import { Typography, Box } from "@mui/material"
import { FaMapLocationDot } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuPartyPopper } from "react-icons/lu";

const EventCard = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleString("en-SG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Singapore"
  })

  return (
    <Link to={`/events/${event.id}`} className="event-card-link" style={{ textDecoration: 'none' }}>
      <Box className="event-card" style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" component="h3" className="event-title" style={{ marginBottom: '8px' }}>
          <LuPartyPopper style={{ marginRight: '4px' }} />
          {event.title}
        </Typography>
        <Typography variant="body1" className="event-location" style={{ marginBottom: '4px' }}>
          <FaMapLocationDot style={{ marginRight: '4px' }} />
          {event.location}
        </Typography>
        <Typography variant="body2" className="event-location" style={{ marginBottom: '4px' }}>
          <FaPeopleGroup style={{ marginRight: '4px' }} />
          {event.numAttendees} slots left
        </Typography>
        <Typography variant="body3" className="event-datetime" color="textSecondary">
          <FaRegClock style={{ marginRight: '4px' }} />
          {formattedDate}
        </Typography>
      </Box>
    </Link>
  )
}

export default EventCard
