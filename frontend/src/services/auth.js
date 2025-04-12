import axios from 'axios'
const baseUrl = '/api/auth'

/**
 * Log in a user with their credentials.
 * @async
 * @param {Object} credentials - The user's login credentials.
 * @param {string} credentials.username - The username of the user.
 * @param {string} credentials.password - The password of the user.
 * @returns {Promise<Object>} The logged-in user's data, including the authentication token.
 */
const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials)
  return response.data
}

/**
 * Register a new user.
 * @async
 * @param {Object} newUserData - The data for the new user.
 * @param {string} newUserData.username - The username of the new user.
 * @param {string} newUserData.password - The password of the new user.
 * @param {string} newUserData.name - The full name of the new user.
 * @param {string} newUserData.phoneNumber - The phone number of the new user.
 * @returns {Promise<Object>} The created user's data.
 * @throws {string} An error message if the registration fails.
 */
const createUser = async (newUserData) => {
  try {
    const response = await axios.post(baseUrl, newUserData, {
      headers: {
        "Content-Type": "application/json",
      }
    })
    return response.data
  } catch (error) {
    console.error("Error creating user", error)
    throw error.response.data.error
  }
}

/**
 * Find a user by their phone number.
 * @async
 * @param {string} phoneNumber - The phone number of the user to find.
 * @returns {Promise<Object>} The user's data if found.
 */
const findUserWithPhoneNumber = async (phoneNumber) => {
  const response = await axios.post(`${baseUrl}/find-by-phone`, {
    phoneNumber
  })
  return response.data

}

/**
 * Change the password of a user.
 * @async
 * @param {Object} data - The data required to change the password.
 * @param {string} data.username - The username of the user.
 * @param {string} data.password - The new password.
 * @param {string} data.confirmPassword - The confirmation of the new password.
 * @param {string} data.otp - The one-time password for verification.
 * @returns {Promise<Object>} A success message if the password is changed successfully.
 */
const changePassword = async ({ username, password, confirmPassword, otp }) => {

  const response = await axios.post(`${baseUrl}/change-password`, { username, password, confirmPassword, otp })
  return response.data

}

export default {
  login,
  createUser,
  findUserWithPhoneNumber,
  changePassword
}