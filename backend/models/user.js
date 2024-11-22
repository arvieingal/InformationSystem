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
};

module.exports = User;
