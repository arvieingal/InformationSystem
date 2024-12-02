const db = require("../config/db");

const ChildGrowth = {
  findChildGrowthData: async (childId) => {
    try {
      const [rows] = await db.execute(
        `SELECT c.*, i.vaccine_type, i.date_vaccinated
         FROM children c
         LEFT JOIN immunization_records i ON c.child_id = i.child_id
         WHERE c.child_id = ?`,
        [childId]
      );
      return rows || [];
    } catch (error) {
      console.error("Error fetching child growth data:", error);
      throw error;
    }
  },
};

module.exports = ChildGrowth; 