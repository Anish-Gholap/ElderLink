import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext'; // Adjust the import path as necessary
import { FaPencilAlt } from 'react-icons/fa';
import EditProfileDialog from '../components/EditProfileDialog';

function Profile() {
    const { user } = useAuthContext();
    const [openEditProfile, setOpenEditProfile] = React.useState(false);

    return (
        <>
        <EditProfileDialog 
        open={openEditProfile}
        onClose={() => setOpenEditProfile(false)}
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
            <Typography variant="h5">{user.username}</Typography>
            <Typography variant="body1">{user.name}</Typography>
            <Typography variant="body1">{user.phoneNumber}</Typography>
            <Link to="#">
                <IconButton onClick={() => setOpenEditProfile(true)}>
                    <FaPencilAlt />
                </IconButton>
            </Link>
        </Box>     </>
    );
    
}

export default Profile;