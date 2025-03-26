import { useParams } from "react-router-dom"; // to get eventId from url
import { useState, useEffect } from "react"; // to fetch and store event details on page load
import { useEventsContext } from "../contexts/EventsContext"; // to get event using eventId
import { Box, Typography, Button } from '@mui/material';
import { FaMapLocationDot } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuPartyPopper } from "react-icons/lu";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const { getEvent, joinEvent } = useEventsContext();
  
  
  // fetch event
  useEffect(() => {
    getEvent(eventId).then(setEvent);
  }, [eventId, getEvent]); // updates event whenever a new event is clicked on
  
  if (!event) return <Typography>Loading...</Typography>;
  
  const mapUrl = "/map.jpg"; // TODO: replace with actual map image
  const isEventOwner = () => true // TODO: implement this function

  return (

    <Box sx={{
      p: 3,
      backgroundColor: '#f36f00',
      borderRadius: "7%",
      boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
      border: '1px solid #ccc',
      color: 'white',
      minWidth: '40vw',
    }} >
      <Box sx={{ mb: 2 }}>
        <Box sx={{mb:3}}>
          <Typography variant="h3" fontWeight="bold">{event.title}</Typography></Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaPeopleGroup style={{ marginRight: '8px' }} />
          <Typography variant="h6">{event.numAttendees} slots</Typography></Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaMapLocationDot style={{ marginRight: '8px' }} />
          <Typography variant="h6">{event.location}</Typography>
          </Box>
      </Box>
      <Box sx={{ mb: 2, color: "black" }}>
        <Typography variant="h6" fontWeight='600'>Details</Typography>
        <Typography variant="body3">{event.description}</Typography>
      </Box>
      {mapUrl && <img src={mapUrl} alt="map"
      style={{
        width: "100%",
        height: "auto",
        borderRadius: "2%",
        boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
        border: '1px solid #ccc',
        marginBottom: '16px'
      }}
      />}
      <Button variant="contained" color="primary" onClick={() => joinEvent(event.id)}>
        Join event
      </Button>
      {
        isEventOwner() && (
          <Button variant="contained" color="secondary" sx={{ ml: 2 }}>
            Edit event
          </Button>
        )
      }
    </Box>
  );
};

export default EventDetails;