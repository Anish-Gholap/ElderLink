import axios from 'axios'
const baseUrl = '/api/auth'

// login
const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials)
  return response.data
}

// register
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

// find user using phoneNumber
const findUserWithPhoneNumber = async (phoneNumber) => {
  const response = await axios.post(`${baseUrl}/find-by-phone`, {
    phoneNumber
  })
  return response.data

}

// change password
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