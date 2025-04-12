import axios from 'axios'
const baseUrl = '/api/login'

/**
 * Log in a user with their credentials.
 * @async
 * @param {Object} credentials - The user's login credentials.
 * @param {string} credentials.username - The username of the user.
 * @param {string} credentials.password - The password of the user.
 * @returns {Promise<Object>} The logged-in user's data, including the authentication token.
 * @throws {Error} Throws an error if the login request fails.
 */
const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default {
  login
}