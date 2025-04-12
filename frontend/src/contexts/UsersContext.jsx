import { useAuthContext } from "../contexts/AuthContext";
import { createContext, useState, useEffect, useContext } from "react";
import usersService from "../services/users";
import authService from "../services/auth.js"
import { useSnackbar } from "../hooks/useSnackbar";

const UsersContext = createContext();

/**
 * Custom hook to access the UsersContext.
 * @returns {Object} The context value containing user data and helper functions.
 */
export const useUsersContext = () => useContext(UsersContext);

/**
 * UsersProvider component to manage user-related state and provide it to child components.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to the UsersContext.
 * @returns {JSX.Element} The UsersContext provider component.
 */
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

    /**
     * Edit the profile of a user.
     * @async
     * @param {string} userId - The ID of the user to edit.
     * @param {Object} updatedData - The updated user data.
     * @param {string} token - The authentication token.
     * @returns {Promise<void>}
     */
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

    /**
     * Create a new user.
     * @async
     * @param {Object} newUserData - The data for the new user.
     * @returns {Promise<void>}
     */
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
    
    /**
     * Check if a username already exists.
     * @async
     * @param {string} username - The username to check.
     * @returns {Promise<Object|null>} The user data if the username exists, or `null` if it does not.
     */
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
