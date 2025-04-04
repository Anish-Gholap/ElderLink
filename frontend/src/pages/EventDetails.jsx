import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useEventsContext } from "../contexts/EventsContext";
import { Box, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import { FaArrowLeft, FaClock, FaMapLocationDot } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuPartyPopper } from "react-icons/lu";
import EventLocationMap from "../components/EventLocationMap"; // Import our map component
import { findLocationByName } from "../services/locations"; // Import location service
import { useAuthContext } from "../contexts/AuthContext";
import userService from '../services/users';

const EventDetails = () => {
  const { eventId } = useParams();
  const { user } = useAuthContext();
  const [event, setEvent] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [host, setHost] = useState(null);
  const { getEvent, joinEvent } = useEventsContext();

  // Fetch event
  useEffect(() => {
    getEvent(eventId).then(setEvent);
  }, [eventId, getEvent]);

  // Fetch location and owner data when event changes
  useEffect(() => {
    if (!event || !event.location) return;

    const getLocationData = async () => {
      setIsLoadingMap(true);

      try {
        // Try to find the location by name in our API
        const data = await findLocationByName(event.location);

        if (data) {
          setLocationData(data);
        } else {
          console.warn(`Location not found for: ${event.location}`);
          // You could set a default or fallback here
        }
      } catch (error) {
        console.error("Failed to fetch location data:", error);
      } finally {
        setIsLoadingMap(false); // Not adding an error snackbar here since it doesnt make sense
      }
    };

    const getOwnerData = async () => {
      try {
        const founduser = await userService.getAllUsers(event.createdBy);
        console.log("founduser", founduser);
        if (founduser) {
          setHost(founduser);
        } else {
          console.warn(`Owner not found for: ${event.createdBy}`);
        }
      }
      catch (error) {
        console.error("Failed to fetch owner data:", error);
      }
    };
    // Fetch location data and owner data
    getLocationData();
    getOwnerData();

  }, [event]);

  if (!event) return <Typography>Loading...</Typography>;

  return (<>
    <IconButton
      onClick={() => window.history.back()}
      size="large"
      color="inherit"
    >
      <FaArrowLeft fontSize="2rem" />
    </IconButton>

    <Box sx={{
      p: 3,
      backgroundColor: '#f36f00',
      borderRadius: "7%",
      boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
      border: '1px solid #ccc',
      color: 'white',
      minWidth: '40vw',
    }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" fontWeight="bold">{event.title}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaPeopleGroup style={{ marginRight: '8px' }} />
          <Typography variant="h6">{event.numAttendees} slots</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaMapLocationDot style={{ marginRight: '8px' }} />
          <Typography variant="h6">{event.location}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FaClock style={{ marginRight: '8px' }} />
          <Typography variant="h6">{new Date(event.date).toLocaleString("en-SG", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Singapore"
          })}</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2, color: "black" }}>
        <Typography variant="h6" fontWeight='600'>Details</Typography>
        <Typography variant="body3">{event.description}</Typography>
      </Box>

      <Box sx={{ mb: 2, color: "black" }}>
        <Typography variant="h6" fontWeight='600'>Host Details</Typography>
        <Typography variant="body3"><span style={{ fontWeight: 'bold' }}>Name: </span>{host ? host.name : "Loading host data..."}</Typography>
        <br /><Typography variant="body3"><span style={{ fontWeight: 'bold' }}>Phone Number: </span>{host ? host.phoneNumber : "Loading host data..."}</Typography>
      </Box>

      {/* Map Section */}
      <Box sx={{ mb: 2, position: 'relative', minHeight: '200px' }}>
        {isLoadingMap ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px'
          }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : locationData ? (
          <EventLocationMap
            locationData={locationData}
            height={250}
          />
        ) : (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'white'
          }}>
            <Typography>Location map not available</Typography>
          </Box>
        )}
      </Box>

      {user.id !== event.createdBy &&

        <Button
          variant="contained"
          color="primary"
          onClick={() => joinEvent(event.id)}
          sx={{ mt: 2 }}
        >
          Join event
        </Button>}
    </Box>

  </>
  );
};

export default EventDetails;