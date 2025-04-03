import { useEventsContext } from "../contexts/EventsContext";
import EventCard from "../components/EventCard";
import { useAuthContext } from "../contexts/AuthContext" // Add this import
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from '@mui/material';
import Toggle from "../components/Toggle"

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
    <Container sx={{ mt: 4, mb: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>

      <Typography textAlign='center' fontWeight={700} variant="h4" mb={3}>Manage Events</Typography>

      <Toggle defaultToggle="attending-events" />
      {userEventsAttending.map(event => (
        <Box key={event.id} sx={{ mb: 2, position: "relative" }}>
          <EventCard event={event} sx={{
            minWidth: "300px",
            position: "relative"
          }} />
          <Box sx={{ mt: 1, position: "absolute", right: 10, top: 7 }}>
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
      {
        userEventsAttending.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6">You are not attending any events.</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Explore and join exciting events happening near you!
            </Typography>

          </Box>
        )
      }
      <Link to="/event-discovery" style={{ textDecoration: 'none' }}>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Discover Events
        </Button>
      </Link>
    </Container>
  );
};

export default EventAttendance;