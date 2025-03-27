import { useAuthContext } from "../contexts/AuthContext";
import { createContext, useState, useEffect, useContext } from "react";
import usersService from "../services/users";

const UsersContext = createContext();

export const useUsersContext = () => useContext(UsersContext);

export const UsersProvider = ({ children }) => {
    const { user } = useAuthContext();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        if (user?.id) {
            fetchUserById();
        } else {
            setLoading(false); 
        }
    }, [user?.id]);

    if (loading) return <div>Loading...</div>;

    return (
        <UsersContext.Provider value={{ userData }}>
            {children}
        </UsersContext.Provider>
    );
};
