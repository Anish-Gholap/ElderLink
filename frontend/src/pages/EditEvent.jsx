import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEventsContext } from "../contexts/EventsContext";
import { useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";
import { useSnackbar } from "../hooks/useSnackbar.js";
import SnackbarComponent from "../components/SnackbarComponent.jsx";
import dayjs from "dayjs";

/**
 * EditEvent component for editing an existing event.
 * Provides a form pre-filled with the event's current details and handles event update logic.
 * @component
 * @returns {JSX.Element} The EditEvent page component.
 */
const EditEvent = () => {
  const { eventId } = useParams();
  const { getEvent, updateEvent } = useEventsContext();
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventNumAttendees, setEventNumAttendees] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [dateTime, setDateTime] = useState(dayjs());

  const [currentAttendeesCount, setCurrentAttendeesCount] = useState(0); // 👈 Add this!

  const snackbar = useSnackbar();

  /**
   * Fetches the event details and populates the form fields.
   * @useEffect
   */
  useEffect(() => {
    getEvent(eventId).then(event => {
      setEventName(event.title || "");
      setEventLocation(event.location || "");
      setEventNumAttendees(event.numAttendees || "");
      setEventDescription(event.description || "");
      setDateTime(dayjs(event.date));
      setCurrentAttendeesCount(event.attendees?.length || 0); // 👈 Add this!
    }).catch(console.error);
  }, [eventId, getEvent]);

  /**
   * Handles the event update process.
   * Validates input fields, sends the updated event data to the backend, and navigates back on success.
   * @async
   * @param {Object} event - The form submission event.
   */
  const handleEventEdit = async (event) => {
    event.preventDefault();

    // Validation checks
    if (!eventName || !eventLocation || !eventNumAttendees || !dateTime || !eventDescription) {
      snackbar.showError("Please fill in all required fields");
      return;
    }

    if (parseInt(eventNumAttendees) < currentAttendeesCount) {
      snackbar.showError(`Number of attendees cannot be less than current attendance (${currentAttendeesCount} attendees)`);
      return;
    }

    const isoDateString = dateTime.toISOString();

    const updatedData = {
      title: eventName,
      location: eventLocation?.label || eventLocation, // Handles both selected and existing values
      numAttendees: parseInt(eventNumAttendees),
      date: isoDateString,
      description: eventDescription
    };

    try {
      await updateEvent(eventId, updatedData);
      snackbar.showSuccess("Event edited successfully!", "/events-management");
    } catch (error) {
      console.log("Failed to update event:", error);
      snackbar.showError(`${error}`);
    }
  };

  /**
   * Handles the cancel action, navigating back to the events management page.
   * @param {Object} event - The form submission event.
   */
  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/events-management");
  };

  /**
   * Handles changes to the number of attendees input field.
   * Ensures the value is a positive number or empty.
   * @param {Object} target - The input event target.
   */
  const handleEventNumAttendeesChange = ({ target }) => {
    const value = parseInt(target.value);
    if (value >= 1 || target.value === '') {
      setEventNumAttendees(target.value);
    }
  };

  return (
    <>
      <div>
        <h1>Edit Event</h1>
        <EventForm
          handleSubmit={handleEventEdit}
          handleCancel={handleCancel}
          eventName={eventName}
          eventLocation={eventLocation}
          eventNumAttendees={eventNumAttendees}
          eventDescription={eventDescription}
          dateTime={dateTime}
          handleEventNameChange={({ target }) => setEventName(target.value)}
          handleEventLocationChange={(newValue) => setEventLocation(newValue)}
          handleEventNumAttendeesChange={handleEventNumAttendeesChange}
          handleEventDescriptionChange={({ target }) => setEventDescription(target.value)}
          handleDateTimeChange={(newDateTime) => setDateTime(newDateTime)}
        />
        <SnackbarComponent
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          autoHideDuration={snackbar.autoHideDuration}
          handleClose={snackbar.handleClose}
        />
      </div>
    </>
  );
};

export default EditEvent;
