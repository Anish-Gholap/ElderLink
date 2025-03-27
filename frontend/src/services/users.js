import axios from "axios";
const baseUrl = "/api/users";

const getAllUsers = async (userId) => {
    const response = await axios.get(`${baseUrl}`);
    const users = response.data;
    const user = users.find(user => user.id === userId);
    return user
  }

  const updateUser = async (userId, updatedData, token) => {
    try {
        const response = await axios.patch(`${baseUrl}/profile`, { userId, ...updatedData }, {
          headers: {
              Authorization: `Bearer ${token}`, // Include token for authorization
          }
      });
        return response.data; // Returning updated user data after success
    } catch (error) {
        console.error("Error updating user", error);
        throw error; // Rethrow error for handling in the component or context
    }
};



  export default {
    getAllUsers,
    //createUser,
    //deleteUser,
    updateUser,
  }