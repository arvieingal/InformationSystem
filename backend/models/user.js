const pool = require("../config/db");

const { userQueries } = require("../queries/query");

const User = {
  findAllUser: async () => {
    try {
      const [rows] = await pool.execute(userQueries.findAllUser);
      console.log("Rows retrieved from database:", rows);
      return rows || [];
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
  createUser: async (userData) => {
    try {
      const [result] = await pool.execute(userQueries.insert, [
        userData.username,
        userData.email,
        userData.password,
        userData.role,
        userData.status,
      ]);
      return result;
    } catch (error) {
      console.error("Error executing createUser query:", error);
      throw error;
    }
  },
  updateUser: async (userId, userData) => {
    try {
      const [result] = await pool.execute(userQueries.update, [
        userData.username,
        userData.email,
        userData.password,
        userData.role,
        userData.status,
        userId,
      ]);
      return result;
    } catch (error) {
      console.error("Error executing updateUser query:", error);
      throw error;
    }
  },
  updatePassword: async (userId, hashedPassword) => {
    try {
      const [result] = await pool.execute(userQueries.updatePassword, [hashedPassword, userId]);
      return result;
    } catch (error) {
      console.error("Error executing updatePassword query:", error);
      throw error;
    }
  }
};

module.exports = User;
