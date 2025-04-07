import { useAuthContext } from "../contexts/AuthContext";
import { createContext, useState, useEffect, useContext } from "react";
import usersService from "../services/users";
import { useSnackbar } from "../hooks/useSnackbar";

const UsersContext = createContext();

export const useUsersContext = () => useContext(UsersContext);

export const UsersProvider = ({ children }) => {
    const { user } = useAuthContext();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const snackbar = useSnackbar();
    
    const fetchUserById = async () => {
        if (!user?.id) return;
        try {
            const data = await usersService.getAllUsers(user.id);
            setUserData(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching user data", err);
            snackbar.showError("Error fetching user data. Please try again.");
            setLoading(false); 
        }
    };
    
    useEffect(() => {
        if (user?.id) {
            fetchUserById();
        } else {
            setLoading(false); 
        }
    }, [user?.id]);

    //Instead of waiting for 1-2s of refetching, I changed the display instantly. I assume backend will always be successful
    const editProfileHandler = async (userId, updatedData, token) => {
        try {
            const updatedUser = await usersService.updateUser(userId, updatedData, token); 
            const refreshedUser = await usersService.getAllUsers(userId, token);
            setUserData(refreshedUser);
            //setLoading(true);
            
            //setLoading(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
            snackbar.showError("Failed to update profile. Please try again.");
            //setLoading(false);
        }
    };

    const createUserHandler = async (newUserData) => {
        try {
            const createdUser = await usersService.createUser(newUserData);
    
            setUserData(prevData => ({
                ...prevData,
                createdUser, // Ensure this matches your state structure
            }));
        } catch (error) {
            console.error("Failed to create user:", error);
            snackbar.showError("Failed to create user. Please try again.");
        }
    };
    
    

    if (loading) return <div>Loading...</div>;

    return (
        <UsersContext.Provider value={{ userData, editProfileHandler, createUserHandler }}>
            {children}
        </UsersContext.Provider>
    );
};
