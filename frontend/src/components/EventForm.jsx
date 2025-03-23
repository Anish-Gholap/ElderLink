const EventForm = ({
    handleSubmit,
    handleCancel,
    handleEventNameChange, 
    handleEventLocationChange, 
    handleEventDateTimeChange, 
    handleEventDescriptionChange, 
    handleEventNumAttendeesChange,
    eventName,
    eventLocation,
    eventDateTime,
    eventNumAttendees,
    eventDescription
  }) => {
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          Event Name
          <input
            type="text"
            name="Event Name"
            value={eventName}
            onChange={handleEventNameChange}
          />
        </div>
        <div>
          Location
          <input
            type="text"
            name="Location"
            value={eventLocation}
            onChange={handleEventLocationChange}
          />
        </div>
        <div>
          Number of Attendees
          <input
            type="text"
            name="Number of Attendees"
            value={eventNumAttendees}
            onChange={handleEventNumAttendeesChange}
          />
        </div>
        <div>
          Date & Time
          <input
            type="text"
            name="Date and Time"
            value={eventDateTime}
            onChange={handleEventDateTimeChange}
          />
        </div>
        <div>
          Description
          <input
            type="text"
            name="Description"
            value={eventDescription}
            onChange={handleEventDescriptionChange}
          />
        </div>
        <div>
          <button onClick={handleCancel}> Cancel </button>\
          <button type="submit"> Save </button>
        </div>
      </form>
    )
  }
  
  export default EventForm