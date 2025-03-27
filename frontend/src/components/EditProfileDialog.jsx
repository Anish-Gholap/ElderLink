
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';


const EditProfileDialog = ({ open, onClose, onSubmit, userData }) => {
    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        if (open && userData) {  // Set state only when the dialog opens
            setUserName(userData.username || '');
            setName(userData.name || '');
            setPhoneNumber(userData.phoneNumber || '');
        }
    }, [open, userData]);

    const handleSubmit = () => {
        const updatedData = { username: userName, name, phoneNumber };
        onSubmit(updatedData);  // Call the passed function with new data
        onClose();  // Close the dialog
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="userName"
                    label="Username"
                    type="text"
                    fullWidth
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="phoneNumber"
                    label="Phone Number"
                    type="text"
                    fullWidth
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileDialog;