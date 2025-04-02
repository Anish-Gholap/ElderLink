import React, { useState } from 'react'
import { useNotificationsContext } from '../contexts/NotificationsContext'
import NotificationsDialog from '../components/NotificationsDialog'
import { IconButton } from '@mui/material'
import { FaBell } from 'react-icons/fa6'

function NotificationsPage() {
    const { notifications, removeNotification } = useNotificationsContext()
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <div>
            <IconButton onClick={handleOpen} size="large" color="inherit">
                <FaBell />
                { (
                    <span style={{ position: 'absolute', top: 0, right: 0, color: 'red' }}>
                        {notifications.length}
                    </span>
                )}
            </IconButton>
            <NotificationsDialog 
                notifications={notifications} 
                open={open} 
                handleDelete={handleDelete}
                  userId={user.id}
                  onClose={() => {
                    console.log("close notif");
                    handleClose(false)
                  }}
            />
        </div>
    )
}

export default NotificationsPage
