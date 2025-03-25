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

function NotificationsDialog({
    notifications = [],
    open,
    onClose
}) {
    return <Dialog open={open} onClose={onClose} sx={
        {
            zIndex: 2001
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
                                borderRadius: 1
                            }
                        }
                    >
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
    </Dialog>
}

export default NotificationsDialog