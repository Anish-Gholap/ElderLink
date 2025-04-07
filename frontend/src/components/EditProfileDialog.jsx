
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';


const EditProfileDialog = ({ open, onClose, onSubmit, userData, checkUsernameExist }) => {
    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (open && userData) {  // Set state only when the dialog opens
            setUserName(userData.username || '');
            setName(userData.name || '');
            setPhoneNumber(userData.phoneNumber || '');
        }
    }, [open, userData]);

    const handleSubmit = async () => {
        const validationError = await validateDetails(); 
        if (validationError) {
            setErrorMessage(validationError);
            return; 
        }

        const updatedData = { username: userName, name, phoneNumber };
        onSubmit(updatedData);  
        onClose();  
        setErrorMessage('');  
    };

    const validateDetails = async () => {
        if (!userName || !name || !phoneNumber) {
            return "Please fill in all fields";
        }

        // Check if username has minimum 3 characters and is alphanumeric
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (userName.length < 3 || userName.length > 12) {
            return "Username must be between 3 and 12 characters long";
        }
        if (!usernameRegex.test(userName)) {
            return "Username must contain only alphanumeric characters (no special characters)";
        }

        // Check if name has minimum 3 characters and is alphabetic (allows spaces)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (name.length < 3) {
            return "Name must be at least 3 characters long";
        }
        if (!nameRegex.test(name)) {
            return "Name must contain only alphabets and spaces";
        }

        // Check if phone number is exactly 8 digits
        const phoneNumberRegex = /^[0-9]{8}$/;
        if (!phoneNumberRegex.test(phoneNumber)) {
            return "Phone number must be exactly 8 digits long and contain only numbers";
        }

        // Check if username exists (only if changed)
        if (userName !== userData.username) {
            const userExists = await checkUsernameExist(userName);
            if (userExists) {
                return "Username already exists.";  
            }
        }

        return null;  
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
                {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
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
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileDialog;