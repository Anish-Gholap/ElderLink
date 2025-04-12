import "../css/eventcard.css"
import { Link, useNavigate } from "react-router-dom"
import { Typography, Box, Button } from "@mui/material"
import { FaMapLocationDot } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuPartyPopper } from "react-icons/lu";

/**
 * EventCard component for displaying event details.
 * Provides a clickable card interface to navigate to the event details page.
 * Displays event title, location, attendees, and date/time.
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.event - The event data.
 * @param {string} props.event.id - The unique ID of the event.
 * @param {string} props.event.title - The title of the event.
 * @param {string} props.event.location - The location of the event.
 * @param {Array} [props.event.attendees] - The list of attendees for the event.
 * @param {number} props.event.numAttendees - The maximum number of attendees for the event.
 * @param {string} props.event.date - The date and time of the event in ISO format.
 * @param {Function} [props.handleDelete] - Optional function to handle event deletion.
 * @param {Object} [props.sx] - Optional styles to apply to the card.
 * @param {JSX.Element|null} [props.actions] - Optional actions (e.g., buttons) to display on the card.
 * @returns {JSX.Element} The EventCard component.
 */
const EventCard = ({ event, handleDelete, sx, actions = null}) => {
  const navigate = useNavigate()

  const formattedDate = new Date(event.date).toLocaleString("en-SG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Singapore"
  })

  return (

    <Box sx={{
      ...sx,
      cursor: "pointer",
      "&:hover": {
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transform: 'scale(1.02)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      },
      "&:active": {
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transform: 'scale(0.98)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      },
    }}

      className="event-card"
      style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
    >
      <Box onClick={() => navigate(`/events/${event.id}`)}>

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
        {event.attendees?.length || 0} / {event.numAttendees} attendees
        {" — "}
        {event.numAttendees - (event.attendees?.length || 0)} spots left
        </Typography>
        <Typography variant="body3" className="event-datetime" color="textSecondary">
          <FaRegClock style={{ marginRight: '4px' }} />
          {formattedDate}
        </Typography>
      </Box>
      {actions}
    </Box>

  )
}

export default EventCard
