import { useEventsContext } from "../contexts/EventsContext";
import EventCard from "../components/EventCard";
import { useAuthContext } from "../contexts/AuthContext" // Add this import
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from '@mui/material';
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

const EventAttendance = () => {
  const { user } = useAuthContext();
  const { userEventsAttending, withdrawEvent } = useEventsContext();
  const navigate = useNavigate();

  const handleWithdraw = async (eventId) => {
    try {
      await withdrawEvent(eventId); // Call the withdrawEvent function from context
      window.alert("Successfully withdrawn from the event.");
    } catch (error) {
      console.error("Error withdrawing from event:", error);
      window.alert("There was an error withdrawing from the event.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Events
      </Typography>
      <Toggle defaultToggle="attending-events" />
      {userEventsAttending.map(event => (
        <Box key={event.id} sx={{ mb: 2, position: "relative" }}>
          {console.log("Event id ", event.id)}
          <EventCard event={event} sx={{
            minWidth: "300px",
            position: "relative"
          }} />
          <Box sx={{ mt: 1, position: "absolute", right: 10, top:7 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleWithdraw(event.id)}
            >
              Withdraw
            </Button>
          </Box>
        </Box>
      ))}
      <CreateEventButton />
    </Container>
  );
};

export default EventAttendance;