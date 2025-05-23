import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext'; // Adjust the import path as necessary
import { useUsersContext } from '../contexts/UsersContext';
import { FaPencilAlt } from 'react-icons/fa';
import EditProfileDialog from '../components/EditProfileDialog';
import { useSnackbar } from '../hooks/useSnackbar';
import SnackbarComponent from '../components/SnackbarComponent';

/**
 * Profile component for displaying and editing the user's profile.
 * Fetches user details from the `AuthContext` and `UsersContext`.
 * Allows the user to edit their profile using a dialog.
 * @component
 * @returns {JSX.Element} The Profile page component.
 */
function Profile() {
    //AuthContext holds no information regarding user details except name, username and id
    const { user } = useAuthContext();
    //Seperate Extract required from UserContext
    const { userData, editProfileHandler, checkUsernameExist  } = useUsersContext();
    const [openEditProfile, setOpenEditProfile] = React.useState(false);
    const snackbar = useSnackbar();

    /**
     * Handles the profile edit submission.
     * Sends the updated profile data to the server and updates the UI on success.
     * @async
     * @param {Object} updatedData - The updated profile data.
     * @throws {Error} Displays an error message if the update fails.
     */
    const handleProfileEdit = async (updatedData) => {
        try {
            await editProfileHandler(user.id, updatedData, user.token);
            setOpenEditProfile(false);
            snackbar.showSuccess("Profile Updated!")
        } catch (error) {
            console.log("Failed to update profile:", error);
            snackbar.showError("Failed to update profile. Please try again.");
        }
    };

    return (
        <>
            <SnackbarComponent
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                autoHideDuration={snackbar.autoHideDuration}
                handleClose={snackbar.handleClose}
            />
            <EditProfileDialog
                open={openEditProfile}
                onClose={() => setOpenEditProfile(false)}
                onSubmit={handleProfileEdit}
                userData={userData}
                checkUsernameExist={checkUsernameExist}
            />

            <Box
                sx={{
                    minWidth: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh'
                }}
            >
                <Avatar
                    sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        mb: 2
                    }}
                    src={user.profileImage || '/path/to/placeholder/image.jpg'}
                    alt="Profile Image"
                />
                <Typography variant="h5">{userData.username}</Typography>
                <Typography variant="body1">{userData.name}</Typography>
                <Typography variant="body1">{userData.phoneNumber}</Typography>
                <Link to="#">
                    <IconButton onClick={() => setOpenEditProfile(true)}>
                        <FaPencilAlt />
                    </IconButton>
                </Link>
            </Box>     </>
    );

}

export default Profile;