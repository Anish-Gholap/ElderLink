import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEventsContext } from "../contexts/EventsContext";
import { useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";

const EditEvent = () => {
  const { eventId } = useParams();
  const { getEvent, updateEvent } = useEventsContext();
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventNumAttendees, setEventNumAttendees] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  useEffect(() => {
    getEvent(eventId).then(event => {
      if (event.date) {
        const parsedDate = new Date(event.date);

        setYear(parsedDate.getFullYear().toString());
        setMonth(parsedDate.getMonth().toString()); // 0-indexed
        setDay(parsedDate.getDate().toString());
        setHours(parsedDate.getHours().toString().padStart(2, "0"));
        setMinutes(parsedDate.getMinutes().toString().padStart(2, "0"));
      }

      setEventName(event.title || "");
      setEventLocation(event.location || "");
      setEventNumAttendees(event.numAttendees || "");
      setEventDescription(event.description || "");
    }).catch(console.error);
  }, [eventId, getEvent]);

  const handleEventEdit = async (event) => {
    event.preventDefault();

    const selectedDate = new Date(
      parseInt(year),
      parseInt(month),
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
    const isoDateString = selectedDate.toISOString();

    const updatedData = {
      title: eventName,
      location: eventLocation,
      numAttendees: eventNumAttendees,
      date: isoDateString,
      description: eventDescription,
    };

    try {
      await updateEvent(eventId, updatedData);
      navigate("/events-management");
    } catch (error) {
      console.log("Failed to update event:", error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    navigate("/events-management");
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
          year={year}
          month={month}
          day={day}
          hours={hours}
          minutes={minutes}
          handleEventNameChange={({ target }) => setEventName(target.value)}
          handleEventLocationChange={({ target }) => setEventLocation(target.value)}
          handleEventNumAttendeesChange={({ target }) => setEventNumAttendees(target.value)}
          handleEventDescriptionChange={({ target }) => setEventDescription(target.value)}
          handleYearChange={({ target }) => setYear(target.value)}
          handleMonthChange={({ target }) => setMonth(target.value)}
          handleDayChange={({ target }) => setDay(target.value)}
          handleHoursChange={({ target }) => setHours(target.value)}
          handleMinutesChange={({ target }) => setMinutes(target.value)}
        />
      </div>
    </>
  );
};

export default EditEvent;
