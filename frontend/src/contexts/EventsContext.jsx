/* eslint-disable react-refresh/only-export-components */
// Context to manage events across all
import {createContext, useCallback, useContext, useEffect, useState} from "react";
import eventsService from "../services/events"
import {useAuthContext} from "../contexts/AuthContext"

const EventsContext = createContext()

export const useEventsContext = () => useContext(EventsContext)

export const EventsProvider = ({ children }) => {
  const { user } = useAuthContext()

  const [allEvents, setAllEvents] = useState([])
  const [myEvents, setMyEvents] = useState([])
  const [userEventsAttending, setUserEventsAttending] = useState([])

  // 1) Fetch all events for events discovery
  useEffect(() => {
    eventsService.getAllEvents()
      .then(data => setAllEvents(data))
      .catch(err => console.error("Error fetching all events: ", err))
  }, [])

  // 2) Fetch user-specific events for manage events
  useEffect(() => {
    if (user && user.id) {
      eventsService.getUserEvents(user.id)
        .then(data => setMyEvents(data))
        .catch(err => console.error("Error fetching user events:", err));
    } else {
      // If user logs out or no user, clear
      console.log("No user found, skipping fetch.")
      setMyEvents([]);
    }
  }, [user])

  // Fetch user-specific events for events attendance
  const fetchEventsAttending = useCallback(async () => {
    if (user && user.id && user.token) {
      try {
        const data = await eventsService.getUserAttendingEvents(user.id, user.token)
        console.log("User events attending: ", data)
        setUserEventsAttending(data)
      } catch (err) {
        console.error("Error fetching user's events attending", err)
        setUserEventsAttending([])
      }
    } else {
      setUserEventsAttending([])
    }
  }, [user])


  useEffect(() => {
    fetchEventsAttending()
  }, [fetchEventsAttending]);

  // helper functions to refetch and update local state to keep everything in sync
  const addEvent = async (eventData) => {
    // send token for authorization
    const response = await eventsService.createEvent(eventData, user.token)
    console.log(response)
    
    const refreshedAll = await eventsService.getAllEvents()
    setAllEvents(refreshedAll)

    // If user is creator, refetch their events
    if (user?.id) {
      const refreshedMine = await eventsService.getUserEvents(user.id)
      setMyEvents(refreshedMine)
    }
  }

  const removeEvent = async (eventId) => {
    // send token for authorization
    await eventsService.deleteEvent(eventId, user.token)

    const refreshedAll = await eventsService.getAllEvents();
    setAllEvents(refreshedAll);

    if (user?.id) {
      const refreshedMine = await eventsService.getUserEvents(user.id);
      setMyEvents(refreshedMine);
    }
  }

  const getEvent = async (eventId) => {
    if (!eventId) return null

    try {
      return await eventsService.getEventById(eventId)
    } catch (error) {
      console.error("Error fetching event:", error)
    }
  }

  const updateEvent = async (eventId, eventData) => {
    try {
      console.log("Hello", eventData)
      await eventsService.editEvent(eventId, eventData, user.token)

      // refresh event lists after update
      const refreshedAll = await eventsService.getAllEvents()
      setAllEvents(refreshedAll)

      if (user?.id) {
        const refreshedMine = await eventsService.getUserEvents(user.id);
        setMyEvents(refreshedMine);
      }

    } catch (error) {
      console.log(error)
    }
  }

  const joinEvent = async (eventId) => {
    // get event to join
    try {
      const event = await eventsService.getEventById(eventId)

      if (!event) {
        console.error("Event not found")
        return
      }

      // send updated event
      await eventsService.joinEvent(eventId, user.id, user.token)
      window.alert("Joined event successfully")

      // refresh event lists after update
      const refreshedAll = await eventsService.getAllEvents()
      setAllEvents(refreshedAll)

      await fetchEventsAttending()

      if (user?.id) {
        const refreshedMine = await eventsService.getUserEvents(user.id);
        setMyEvents(refreshedMine);
      }

    } catch (error) {
      console.error("Failed to join event:", error)
      window.alert("Unable to join event")
    }
    
  }
  const withdrawEvent = async (eventId) => {
    try {
      await eventsService.withdrawEvent(eventId, user.id, user.token);
      window.alert("Withdrawn from event successfully");
  
      // Refresh event lists after update
      const refreshedAll = await eventsService.getAllEvents();
      setAllEvents(refreshedAll);

      await fetchEventsAttending()
  
      if (user?.id) {
        const refreshedMine = await eventsService.getUserEvents(user.id);
        setMyEvents(refreshedMine);
      }
    } catch (error) {
      console.error("Failed to withdraw from event:", error);
    }
  };



  const value = {
    allEvents,
    myEvents,
    userEventsAttending,
    addEvent,
    removeEvent,
    getEvent,
    updateEvent,
    joinEvent,
    withdrawEvent
  }

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  )
} 