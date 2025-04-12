import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button
} from '@mui/material'
import { FaBell } from 'react-icons/fa'

import { ImCross } from "react-icons/im";

/*
schema of notification
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',  // Reference to the Event model
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  notificationType: {
    type: String,
    enum: ['Amended', 'Deleted'],  // Types of notifications
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,  // Whether the notification has been read
  },
*/

/**
 * ConfirmDeleteDialog component for confirming the deletion of a notification.
 * Displays a confirmation dialog with options to cancel or delete the notification.
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the confirmation dialog is open.
 * @param {Function} props.setOpen - Function to toggle the open state of the confirmation dialog.
 * @param {Function} props.handleDelete - Function to handle the deletion of a notification.
 * @param {string} props.userId - The ID of the user associated with the notification.
 * @param {string} props.notificationId - The ID of the notification to delete.
 * @returns {JSX.Element} The ConfirmDeleteDialog component.
 */
const ConfirmDeleteDialog = ({
    open,
    setOpen,
    handleDelete,
    userId,
    notificationId
}) => {
    const onClose = () => setOpen(false);
    const onDelete = () => {
        handleDelete(userId, notificationId);
        onClose();  // Close the delete confirmation dialog
    };

    return (
        <Dialog open={open} onClose={onClose}
            sx={
                {
                    zIndex: 2002,
                }
            }
        >
            <DialogTitle>Delete Notification</DialogTitle>
            <DialogContent>
                <Typography>This notification will be deleted</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onDelete} color="error">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}


/**
 * NotificationsDialog component for displaying a list of user notifications.
 * Allows users to view, delete, and mark notifications as read.
 * Includes a confirmation dialog for deleting notifications.
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.notifications - The list of notifications to display.
 * @param {boolean} props.open - Whether the notifications dialog is open.
 * @param {Function} props.onClose - Function to close the notifications dialog.
 * @param {Function} props.handleDelete - Function to handle the deletion of a notification.
 * @param {string} props.userId - The ID of the user associated with the notifications.
 * @returns {JSX.Element} The NotificationsDialog component.
 */
function NotificationsDialog({
    notifications = [],
    open,
    onClose,
    handleDelete,
    userId,
    notificationId
}) {
    const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);
    const [notificationIdToDelete, setNotificationIdToDelete] = React.useState(null);
    
    return <>
        <ConfirmDeleteDialog 
        open={openConfirmDelete} 
        setOpen={setOpenConfirmDelete}
        notificationId={notificationIdToDelete}
        userId = {userId}
        handleDelete={handleDelete} />
        <Dialog open={open} fullWidth onClose={onClose} sx={
            {
                zIndex: 2001,
            }
        }>
            <DialogTitle fontWeight={600}>Notifications</DialogTitle>
            <DialogContent>
                {notifications.length ?
                    notifications.map((notification, index) => (
                        <Box key={index} mb={2}
                            sx={
                                {
                                    backgroundColor: notification.read ? "#f0f0f0" : "white",
                                    padding: 1,
                                    borderRadius: 1,
                                    position: "relative",
                                }
                            }
                        >

                            <ImCross style={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                cursor: "pointer",
                                color: "gray",
                            }}
                                onClick={() => {
                                    setNotificationIdToDelete(notification._id);
                                    setOpenConfirmDelete(true);
                                }}
                            />

                            {
                                notification.read ? null : <Typography variant="body2" color="primary">
                                    <FaBell /> Unread
                                </Typography>
                            }
                            <Typography variant="body1" color={notification.read ? "textSecondary" : ""}>{notification.message}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {notification.createdAt}
                            </Typography>
                        </Box>)
                    )
                    : <Typography variant="body1">No notifications</Typography>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog></>
}

export default NotificationsDialog