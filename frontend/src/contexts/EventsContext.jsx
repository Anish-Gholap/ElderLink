/* eslint-disable react-refresh/only-export-components */
// Context to manage events across all
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import eventsService from "../services/events"
import searchService from "../services/search"
import { useAuthContext } from "../contexts/AuthContext"
import excludeVariablesFromRoot from "@mui/material/styles/excludeVariablesFromRoot.js";
import { useSnackbar } from "../hooks/useSnackbar";

const EventsContext = createContext()

/**
 * Custom hook to access the EventsContext.
 * @returns {Object} The context value containing events data and helper functions.
 */
export const useEventsContext = () => useContext(EventsContext)

/**
 * EventsProvider component to manage events state and provide it to child components.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to the EventsContext.
 * @returns {JSX.Element} The EventsContext provider component.
 */
export const EventsProvider = ({ children }) => {
  const { user } = useAuthContext()

  const [allEvents, setAllEvents] = useState([])
  const [myEvents, setMyEvents] = useState([])
  const [userEventsAttending, setUserEventsAttending] = useState([])
  const [userLat, setUserLat] = useState(null);
  const [userLong, setUserLong] = useState(null);
  const [loading, setLoading] = useState(false)
  const snackbar = useSnackbar();

  useEffect(() => {
    setLoading(true);

    if (userLat && userLong) {
      // Fetch events by distance when location is available
      searchService.getEventsByDistance(userLat, userLong)
        .then(data => {
          setAllEvents(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching events by distance: ", err);
          snackbar.showError("Error fetching events by distance. " + err);
          setLoading(false);
        });
    } else {
      // Fetch all events when no location is available
      searchService.getEventsByDistance()
        .then(data => {
          setAllEvents(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching all events: ", err);
          snackbar.showError("Error fetching all events. " + err);
          setLoading(false);
        });
    }
  }, [userLat, userLong]);

  // 1) Fetch all events for events discovery
  // useEffect(() => {
  //   eventsService.getAllEvents()
  //     .then(data => setAllEvents(data))
  //     .catch(err => console.error("Error fetching all events: ", err))
  // }, [])

  /**
   * Update the user's location.
   * @param {number} latitude - The latitude of the user's location.
   * @param {number} longitude - The longitude of the user's location.
   */
  const updateUserLocation = (latitude, longitude) => {
    setUserLat(latitude);
    setUserLong(longitude);
  }

  // useEffect(() => {
  //   // Check if we have location data before making the API call
  //   if (userLat && userLong) {
  //     searchService.getEventsByDistance(userLat, userLong)
  //         .then(data => setAllEvents(data))
  //         .catch(err => console.error("Error fetching events by distance: ", err))
  //   }
  // }, [userLat, userLong])

  // 2) Fetch user-specific events for manage events
  useEffect(() => {
    if (user && user.id) {
      eventsService.getUserEvents(user.id)
        .then(data => setMyEvents(data))
        .catch(err => {
          console.error("Error fetching user events:", err);
          snackbar.showError("Error fetching user events.  " + err);


        }
        );
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
        snackbar.showError("Error fetching user's events attending.  " + err);
      }
    } else {
      setUserEventsAttending([])
    }
  }, [user])


  useEffect(() => {
    fetchEventsAttending()
  }, [fetchEventsAttending]);

  /**
   * Add a new event.
   * @param {Object} eventData - The data for the new event.
   * @returns {Promise<void>}
   */
  const addEvent = async (eventData) => {
    try {
      // send token for authorization
      const response = await eventsService.createEvent(eventData, user.token)
      console.log(response)

      if (userLat && userLong) {
        const refreshedAll = await searchService.getEventsByDistance(userLat, userLong)
        setAllEvents(refreshedAll)
      } else {
        // Fall back to regular sorting if no location
        const refreshedAll = await searchService.getEventsByDistance()
        setAllEvents(refreshedAll)
      }

      // If user is creator, refetch their events
      if (user?.id) {
        const refreshedMine = await eventsService.getUserEvents(user.id)
        setMyEvents(refreshedMine)
      }
    } catch (exception) {
      console.log("Event Creation Failed: ", exception)
      throw exception
    }
  }

  /**
   * Remove an event.
   * @param {string} eventId - The ID of the event to remove.
   * @returns {Promise<void>}
   */
  const removeEvent = async (eventId) => {
    // send token for authorization
    await eventsService.deleteEvent(eventId, user.token)

    const refreshedAll = await searchService.getEventsByDistance(userLat, userLong)
    setAllEvents(refreshedAll)

    if (user?.id) {
      const refreshedMine = await eventsService.getUserEvents(user.id);
      setMyEvents(refreshedMine);
    }
  }

  /**
   * Get details of a specific event.
   * @param {string} eventId - The ID of the event.
   * @returns {Promise<Object|null>} The event details or `null` if not found.
   */
  const getEvent = async (eventId) => {
    if (!eventId) return null

    try {
      return await eventsService.getEventById(eventId)
    } catch (error) {
      console.error("Error fetching event:", error)
      return {} // or handle the error as needed
    }
  }

  /**
   * Update an existing event.
   * @param {string} eventId - The ID of the event to update.
   * @param {Object} eventData - The updated event data.
   * @returns {Promise<void>}
   */
  const updateEvent = async (eventId, eventData) => {
    try {
      console.log("Hello", eventData)
      await eventsService.editEvent(eventId, eventData, user.token)

      // refresh event lists after update
      const refreshedAll = await searchService.getEventsByDistance(userLat, userLong)
      setAllEvents(refreshedAll)

      if (user?.id) {
        const refreshedMine = await eventsService.getUserEvents(user.id);
        setMyEvents(refreshedMine);
      }

    } catch (error) {
      console.log(error)
      throw error
    }
  }

  /**
   * Join an event.
   * @param {string} eventId - The ID of the event to join.
   * @returns {Promise<void>}
   */
  const joinEvent = async (eventId) => {
    // get event to join
    try {
      const event = await eventsService.getEventById(eventId)

      if (!event) {
        console.error("Event not found")
        snackbar.showError("Event not found")
        return
      }

      // send updated event
      await eventsService.joinEvent(eventId, user.id, user.token)
      snackbar.showSuccess("Joined event successfully")

      // refresh event lists after update
      const refreshedAll = await searchService.getEventsByDistance(userLat, userLong)
      setAllEvents(refreshedAll)

      await fetchEventsAttending()

      if (user?.id) {
        const refreshedMine = await eventsService.getUserEvents(user.id);
        setMyEvents(refreshedMine);
      }

    } catch (error) {
       if (!error) error = "Unknown error"
      console.error("Failed to join event:", error)
      snackbar.showError("Failed to join event: " + error);
    }

  }
  
  /**
   * Withdraw from an event.
   * @param {string} eventId - The ID of the event to withdraw from.
   * @returns {Promise<void>}
   */
  const withdrawEvent = async (eventId) => {
    try {
      await eventsService.withdrawEvent(eventId, user.id, user.token);
      snackbar.showSuccess("Withdrawn from event successfully");

      // Refresh event lists after update
      const refreshedAll = await searchService.getEventsByDistance(userLat, userLong)
      setAllEvents(refreshedAll)

      await fetchEventsAttending()

      if (user?.id) {
        const refreshedMine = await eventsService.getUserEvents(user.id);
        setMyEvents(refreshedMine);
      }
    } catch (error) {
      console.error("Failed to withdraw from event:", error);
      snackbar.showError("Failed to withdraw from event.  " + error);
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
    withdrawEvent,
    updateUserLocation,
    eventSnackbar: snackbar,
  }

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  )
}