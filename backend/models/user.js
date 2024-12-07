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

  findUserById: async function(userId) {
    try {
      console.log("Executing query with userId:", userId);
      const [rows] = await pool.execute(userQueries.findById, [userId]);
      console.log("Query result:", rows);
      return rows[0] || null;
    } catch (error) {
      console.error("Error finding user by ID:", error);
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
      const [result] = await pool.execute(userQueries.updatePassword, [
        hashedPassword,
        userId,
      ]);
      return result;
    } catch (error) {
      console.error("Error executing updatePassword query:", error);
      throw error;
    }
  },
  findUserByEmail: async (email) => {
    try {
      const [rows] = await pool.execute(userQueries.findUserByEmail, [email]);
      console.log("Rows retrieved from database:", rows);
      return rows[0] || null;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
  otpUpdatePassword: async (email, password) => {
    try {
      const [result] = await pool.execute(userQueries.otpUpdatePassword, [
        password,
        email,
      ]);
      console.log("Update result:", result);
      return result.affectedRows > 0; // Return true if a row was updated
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
  deleteUser: async (userId) => {
    try {
      const [result] = await pool.execute(userQueries.delete, [userId]);
      return result;
    } catch (error) {
      console.error("Error executing deleteUser query:", error);
      throw error;
    }
  },
};

module.exports = User;
