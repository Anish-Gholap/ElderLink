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
}

const createUser = async (newUserData) => {
  try {
      const response = await axios.post(`${baseUrl}`, newUserData, {
          headers: {
              "Content-Type": "application/json",
          }
      });
      return response.data; // Return the newly created user
  } catch (error) {
      console.error("Error creating user", error);
      throw error.response.data.error; // Rethrow for handling in the component or context
  }
};




  export default {
    getAllUsers,
    createUser,
    //deleteUser,
    updateUser,
  }