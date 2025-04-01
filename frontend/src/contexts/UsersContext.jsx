import { useAuthContext } from "../contexts/AuthContext";
import { createContext, useState, useEffect, useContext } from "react";
import usersService from "../services/users";

const UsersContext = createContext();

export const useUsersContext = () => useContext(UsersContext);

export const UsersProvider = ({ children }) => {
    const { user } = useAuthContext();
    //console.log("DEBUG1", user.token)
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    
    const fetchUserById = async () => {
        if (!user?.id) return;
        try {
            const data = await usersService.getAllUsers(user.id);
            setUserData(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching user data", err);
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
            setUserData(prevData => ({
                ...prevData,
                ...updatedData,
            }));
            //setLoading(true);
            const updatedUser = await usersService.updateUser(userId, updatedData, token); 
            //setLoading(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
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
        }
    };
    
    

    if (loading) return <div>Loading...</div>;

    return (
        <UsersContext.Provider value={{ userData, editProfileHandler, createUserHandler }}>
            {children}
        </UsersContext.Provider>
    );
};
