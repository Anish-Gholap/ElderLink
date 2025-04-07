import { useAuthContext } from "../contexts/AuthContext";
import { createContext, useState, useEffect, useContext } from "react";
import usersService from "../services/users";
import authService from "../services/auth.js"
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
            const createdUser = await authService.createUser(newUserData);
    
            setUserData(prevData => ({
                ...prevData,
                createdUser,
            }));
        } catch (error) {
            console.error("Failed to create user:", error);
            snackbar.showError("Failed to create user. Please try again.");
        }
    };
    
    const checkUsernameExist = async (username) => {
        try {
            const user = await usersService.checkUsernameExist(username);
            return user;
        } catch (error) {
            console.error("Error checking username:", error);
            return null;
        }
    };
    

    if (loading) return <div>Loading...</div>;

    return (
        <UsersContext.Provider value={{ userData, editProfileHandler, createUserHandler, checkUsernameExist }}>
            {children}
        </UsersContext.Provider>
    );
};
