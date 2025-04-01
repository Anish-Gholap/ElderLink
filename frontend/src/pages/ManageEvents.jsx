import { useEventsContext } from "../contexts/EventsContext";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box, } from '@mui/material';
import Toggle from "../components/Toggle"

const CreateEventButton = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 2 }}>
      <Button variant="contained" color="primary" onClick={() => navigate("/create-event")}>
        Add New Event
      </Button>
    </Box>
  );
};

const ManageEvents = () => {
  const { myEvents, removeEvent } = useEventsContext();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    removeEvent(id).catch(err => console.error(err));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Events
      </Typography>
      <Toggle />
      {myEvents.map(event => (
        <Box key={event.id} sx={{ mb: 2, position: "relative" }}>
          {console.log("Event id ", event.id)}
          <EventCard event={event} sx={{
            minWidth: "300px",
            position: "relative"
          }} handleDelete={handleDelete} />
          
        </Box>
      ))}
      <CreateEventButton />
    </Container>
  );
};

export default ManageEvents;