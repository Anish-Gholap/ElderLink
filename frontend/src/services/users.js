import axios from "axios";
const baseUrl = "/api/users";

const getAllUsers = async (userId) => {
    const response = await axios.get(`${baseUrl}`);
    const users = response.data;
    const user = users.find(user => user.id === userId);
    return user
  }

  export default {
    getAllUsers,
    //createUser,
    //deleteUser,
    //updateUser,
  }