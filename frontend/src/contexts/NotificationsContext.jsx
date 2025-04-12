import { useAuthContext } from "../contexts/AuthContext"
import { createContext, useState, useEffect, useContext } from "react";
import notificationsService from "../services/notifications"

const NotificationsContext = createContext()

/**
 * Custom hook to access the NotificationsContext.
 * @returns {Object} The context value containing notifications data and helper functions.
 */
export const useNotificationsContext = () => useContext(NotificationsContext)

/**
 * NotificationsProvider component to manage notifications state and provide it to child components.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to the NotificationsContext.
 * @returns {JSX.Element} The NotificationsContext provider component.
 */
export const NotificationsProvider = ({ children }) => {
    const { user } = useAuthContext()
    const [notifications, setNotifications] = useState([])
    console.log(user)
    useEffect(() => {
        if (user) {
            console.log("Fetching notifications for user:", user.id); // Log the user ID
            notificationsService.getNotifications(user.id)
                .then(data => {
                    if(data.message && data.message === "User has no notifications"){
                        setNotifications([]);
                    }else {
                        console.log("Notifications fetched:", data);  // Log the fetched notifications
                        setNotifications(data);
                    }
                })
                .catch(error => console.error("Failed to fetch notifications", error));
        }
    }, [user]);
    
    // Debugging the state of notifications
    console.log("Notifications state:", notifications);

    /**
     * Remove a notification for the logged-in user.
     * @param {string} userId - The ID of the user.
     * @param {string} notificationId - The ID of the notification to remove.
     * @returns {Promise<void>}
     */
    const removeNotification = async (UserId, notificationId) => {
        try {
            setNotifications(prevNotifications => {
                const updatedNotifications = prevNotifications.filter(n => n._id !== notificationId);
                console.log("Updated notifications state (before delete request):", updatedNotifications);
                return updatedNotifications;
            });
            const response = await notificationsService.removeNotification(user.id, notificationId);
        } catch (error) {
            console.error("Failed to remove notification", error)
        }
    }

    return (
        <NotificationsContext.Provider value={{ user ,notifications, removeNotification }}>
            {children}
        </NotificationsContext.Provider>
    )
}