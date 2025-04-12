import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box, Autocomplete, CircularProgress } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getLocationNames } from '../services/locations';
/**
 * EventForm component for creating or editing an event.
 * Provides input fields for event details such as name, location, attendees, date/time, and description.
 * Handles form submission and cancellation.
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.handleSubmit - Function to handle form submission.
 * @param {Function} props.handleCancel - Function to handle form cancellation.
 * @param {Function} props.handleEventNameChange - Function to handle changes to the event name input.
 * @param {Function} props.handleEventLocationChange - Function to handle changes to the event location input.
 * @param {Function} props.handleEventDescriptionChange - Function to handle changes to the event description input.
 * @param {Function} props.handleEventNumAttendeesChange - Function to handle changes to the number of attendees input.
 * @param {Function} props.handleDateTimeChange - Function to handle changes to the event date and time input.
 * @param {string} props.eventName - The current value of the event name input.
 * @param {Object} props.eventLocation - The current value of the event location input.
 * @param {number} props.eventNumAttendees - The current value of the number of attendees input.
 * @param {string} props.eventDescription - The current value of the event description input.
 * @param {Object} props.dateTime - The current value of the event date and time input.
 * @returns {JSX.Element} The EventForm component.
 */
const EventForm = ({
                     handleSubmit,
                     handleCancel,
                     handleEventNameChange,
                     handleEventLocationChange,
                     handleEventDescriptionChange,
                     handleEventNumAttendeesChange,
                     handleDateTimeChange,
                     eventName,
                     eventLocation,
                     eventNumAttendees,
                     eventDescription,
                     dateTime
                   }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const locationData = await getLocationNames();

        // Ensure we have an array of strings
        if (Array.isArray(locationData)) {
          setLocations(locationData);
        } else {
          console.error('Locations data is not an array:', locationData);
          setLocations([]);
          setError('Invalid location data received');
        }
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError('Failed to load locations. Please try again later.');
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: 800 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Event Name"
            value={eventName}
            onChange={handleEventNameChange}
            required
            sx={{ backgroundColor: 'white', borderRadius: '5px' }}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            options={locations || []}
            value={eventLocation}
            onChange={(event, newValue) => {
              // When using string array, we need to handle the selection differently
              handleEventLocationChange({ label: newValue });
            }}
            loading={loading}
            sx={{ backgroundColor: 'white', borderRadius: '5px' }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="CC location"
                required
                error={!!error}
                helperText={error}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Number of Attendees"
            type="number"
            value={eventNumAttendees}
            onChange={handleEventNumAttendeesChange}
            required
            inputProps={{ min: 1 }} // Prevents negative values
            sx={{ backgroundColor: 'white', borderRadius: '5px' }}
          />
        </Grid>

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Event Date & Time"
              value={dateTime}
              onChange={handleDateTimeChange}
              sx={{ width: '100%', backgroundColor: 'white', borderRadius: '5px' }}
              minDateTime={dayjs()} // Prevents selecting dates in the past
              slotProps={{
                textField: {
                  required: true,
                  sx: { backgroundColor: 'white', borderRadius: '5px' }
                }
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={eventDescription}
            onChange={handleEventDescriptionChange}
            required
            multiline
            rows={4}
            sx={{ backgroundColor: 'white', borderRadius: '5px' }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button fullWidth variant="contained" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button fullWidth variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EventForm;