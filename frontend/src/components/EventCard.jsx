import "../css/eventcard.css"
import { Link, useNavigate } from "react-router-dom"
import { Typography, Box, Button } from "@mui/material"
import { FaMapLocationDot } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuPartyPopper } from "react-icons/lu";

const EventCard = ({ event, handleDelete, sx }) => {
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
          {event.numAttendees} slots left
        </Typography>
        <Typography variant="body3" className="event-datetime" color="textSecondary">
          <FaRegClock style={{ marginRight: '4px' }} />
          {formattedDate}
        </Typography>
      </Box>
      <Box sx={{ mt: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/events/${event.id}/edit`)}
          sx={{ mr: 1 }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(event.id)}
        >
          Delete
        </Button>
      </Box>
    </Box>

  )
}

export default EventCard
