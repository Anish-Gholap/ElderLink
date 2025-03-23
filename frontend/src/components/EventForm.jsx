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
    <form onSubmit={handleSubmit}>
      <div>
        Event Name
        <input
          type="text"
          name="Event Name"
          value={eventName}
          onChange={handleEventNameChange}
          required
        />
      </div>

      <div>
        Location
        <input
          type="text"
          name="Location"
          value={eventLocation}
          onChange={handleEventLocationChange}
          required
        />
      </div>

      <div>
        Number of Attendees
        <input
          type="number"
          name="Number of Attendees"
          value={eventNumAttendees}
          onChange={handleEventNumAttendeesChange}
          required
        />
      </div>

      <div>
        Date & Time
        <div>
          <input
            type="number"
            name="Year"
            placeholder="Year (e.g. 2025)"
            value={year}
            onChange={handleYearChange}
            required
          />
          <input
            type="number"
            name="Month"
            placeholder="Month (0-11)"
            value={month}
            onChange={handleMonthChange}
            required
          />
          <input
            type="number"
            name="Day"
            placeholder="Day"
            value={day}
            onChange={handleDayChange}
            required
          />
          <input
            type="number"
            name="Hours"
            placeholder="Hours (0-23)"
            value={hours}
            onChange={handleHoursChange}
            required
          />
          <input
            type="number"
            name="Minutes"
            placeholder="Minutes (0-59)"
            value={minutes}
            onChange={handleMinutesChange}
            required
          />
        </div>
      </div>

      <div>
        Description
        <input
          type="text"
          name="Description"
          value={eventDescription}
          onChange={handleEventDescriptionChange}
          required
        />
      </div>

      <div>
        <button onClick={handleCancel} type="button">Cancel</button>
        <button type="submit">Save</button>
      </div>
    </form>
  )
}

export default EventForm
