import React from 'react';
import { TextField, Button, Grid, Box, Autocomplete } from '@mui/material';
import listOfCCs from '../assets/listOfCCs';

const EventForm = ({
  handleSubmit,
  handleCancel,
  handleEventNameChange,
  handleEventLocationChange,
  handleEventDescriptionChange,
  handleEventNumAttendeesChange,
  handleYearChange,
  handleMonthChange,
  handleDayChange,
  handleHoursChange,
  handleMinutesChange,
  eventName,
  eventLocation,
  eventNumAttendees,
  eventDescription,
  year,
  month,
  day,
  hours,
  minutes
}) => {
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: 800 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} >
          <TextField
            fullWidth
            label="Event Name"
            value={eventName}
            onChange={handleEventNameChange}
            required
            sx={{ backgroundColor: 'white', borderRadius: '5px' }}
          />
        </Grid>

        <Grid item xs={12} >
          <Autocomplete
            disablePortal
            options={listOfCCs}
            value={eventLocation}
            onChange={(event, newValue) => handleEventLocationChange(newValue)}
            sx={{ backgroundColor: 'white', borderRadius: '5px' }}
            renderInput={(params) => <TextField
              {...params}
              label="CC location"
            />}
          />
        </Grid>

        <Grid item xs={12} >
          <TextField
            fullWidth
            label="Number of Attendees"
            type="number"
            value={eventNumAttendees}
            onChange={handleEventNumAttendeesChange}
            required
            sx={{ backgroundColor: 'white', borderRadius: '5px' }}
          />
        </Grid>

        <Grid item xs={12} >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Year (e.g. 2025)"
                type="number"
                value={year}
                onChange={handleYearChange}
                required
                sx={{ backgroundColor: 'white', borderRadius: '5px' }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Month (0-11)"
                type="number"
                value={month}
                onChange={handleMonthChange}
                required
                sx={{ backgroundColor: 'white', borderRadius: '5px' }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Day"
                type="number"
                value={day}
                onChange={handleDayChange}
                required
                sx={{ backgroundColor: 'white', borderRadius: '5px' }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Hours (0-23)"
                type="number"
                value={hours}
                onChange={handleHoursChange}
                required
                sx={{ backgroundColor: 'white', borderRadius: '5px' }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Minutes (0-59)"
                type="number"
                value={minutes}
                onChange={handleMinutesChange}
                required
                sx={{ backgroundColor: 'white', borderRadius: '5px' }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} >
          <TextField
            fullWidth
            label="Description"
            value={eventDescription}
            onChange={handleEventDescriptionChange}
            required
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