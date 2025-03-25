import { useAuthContext } from "../contexts/AuthContext"
import { createContext, useState, useEffect, useContext } from "react";
import notificationsService from "../services/notifications"

const NotificationsContext = createContext()

export const useNotificationsContext = () => useContext(NotificationsContext)

export const NotificationsProvider = ({ children }) => {
    const { user } = useAuthContext()
    const [notifications, setNotifications] = useState([])
    console.log(user)
    useEffect(() => {
        if (user) {
            console.log("Fetching notifications for user:", user.id); // Log the user ID
            notificationsService.getNotifications(user.id)
                .then(data => {
                    console.log("Notifications fetched:", data);  // Log the fetched notifications
                    setNotifications(data);
                })
                .catch(error => console.error("Failed to fetch notifications", error));
        }
    }, [user]);
    
    // Debugging the state of notifications
    console.log("Notifications state:", notifications);

    const removeNotification = async (notificationId) => {
        try {
            await notificationsService.removeNotification(user.id, notificationId)
            setNotifications(notifications.filter(n => n.id !== notificationId))
        } catch (error) {
            console.error("Failed to remove notification", error)
        }
    }

    return (
        <NotificationsContext.Provider value={{ notifications, removeNotification }}>
            {children}
        </NotificationsContext.Provider>
    )
}