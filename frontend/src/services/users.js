import axios from "axios";
const baseUrl = "/api/users";

/**
 * Fetch all users and find a specific user by their ID.
 * @async
 * @param {string} userId - The ID of the user to find.
 * @returns {Promise<Object|null>} The user object if found, or `null` if not found.
 * @throws {Error} Throws an error if the request fails.
 */
const getAllUsers = async (userId) => {
    const response = await axios.get(`${baseUrl}`);
    const users = response.data;
    const user = users.find(user => user.id === userId);
    return user
};

/**
 * Check if a username already exists.
 * @async
 * @param {string} username - The username to check.
 * @returns {Promise<Object|null>} The user object if the username exists, or `null` if it does not.
 * @throws {Error} Throws an error if the request fails.
 */
const checkUsernameExist = async (username) => {
  try {
    const response = await axios.get(`${baseUrl}`);
    const users = response.data;
    const user = users.find(user => user.username === username);
    return user;
  } catch (error) {
    console.error("Error checking username:", error);
    return null;
  }
};

/**
 * Update a user's profile.
 * @async
 * @param {string} userId - The ID of the user to update.
 * @param {Object} updatedData - The updated user data.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} The updated user data.
 * @throws {Error} Throws an error if the update request fails.
 */
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

  export default {
    getAllUsers,
    //deleteUser,
    updateUser,
    checkUsernameExist
  }