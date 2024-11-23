const db = require("../config/db");
const { childrenQueries } = require("../queries/query");

const Children = {
  getAllChildren: async () => {
    try {
      const [members] = await db.execute(childrenQueries.findAllChildren);
      return members || [];
    } catch (error) {
      console.error("Error fetching residents:", error);
      throw error;
    }
  },

  // getChildrenByHouseholdId: async (household_id) => {
  //   const query = `
  //       SELECT *
  //       FROM children
  //       WHERE household_id = ?
  //     `;

  //   try {
  //     const [children] = await db.execute(query, [household_id]);
  //     return children;
  //   } catch (error) {
  //     console.error("Error fetching children by household ID:", error);
  //     throw error;
  //   }
  // },

  // getAllArchiveChildren: async () => {
  //   const [rows] = await db.execute(
  //     "SELECT * FROM children WHERE status != ?",
  //     ["Archive"]
  //   );
  //   return rows;
  // },

  // getChildById: async (childId) => {
  //   const [rows] = await db.execute(
  //     "SELECT * FROM children WHERE child_id = ?",
  //     [childId]
  //   );
  //   return rows[0];
  // },

  // addChild: async (childData) => {
  //   const { first_name, last_name, middle_name, gender, birthdate, address } =
  //     childData;
  //   const [result] = await db.execute(
  //     "INSERT INTO children (first_name, last_name, middle_name, gender, birthdate, address) VALUES (?, ?, ?, ?, ?, ?)",
  //     [first_name, last_name, middle_name, gender, birthdate, address]
  //   );
  //   return { child_id: result.insertId, ...childData };
  // },

  // updateChild: async (childId, childData) => {
  //   const { first_name, last_name, middle_name, gender, birthdate, address } =
  //     childData;
  //   await db.execute(
  //     "UPDATE children SET first_name = ?, last_name = ?, middle_name = ?, gender = ?, birthdate = ?, address = ? WHERE child_id = ?",
  //     [first_name, last_name, middle_name, gender, birthdate, address, childId]
  //   );
  //   return { child_id: childId, ...childData };
  // },
};

module.exports = Children;
