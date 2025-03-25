import React, { useState } from 'react'
import { useNotificationsContext } from '../contexts/NotificationsContext'
import NotificationsDialog from '../components/NotificationsDialog'
import { Button } from '@mui/material'

function NotificationsPage() {
    const { notifications, removeNotification } = useNotificationsContext()
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                View Notifications ({notifications.length})
            </Button>
            <NotificationsDialog 
                notifications={notifications} 
                open={open} 
                onClose={handleClose} 
            />
        </div>
    )
}

export default NotificationsPage
