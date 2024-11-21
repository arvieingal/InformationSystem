const db = require('../config/db');

exports.getYoungHouseholdMembers = async (household_id) => {
    const query = `
      SELECT *
      FROM residence
      WHERE household_id = ?
        AND age <= 6
        AND is_household_head = "No"
    `;

    try {
      const members = await db.query(query, [household_id]);
      return members;
    } catch (error) {
      console.error("Error fetching young household members:", error);
      throw error;
    }
};

exports.getAllChildren = async () => {
  const [rows] = await db.execute('SELECT * FROM children WHERE status != ?', ['Archive']);
  return rows;
};

exports.getChildById = async (childId) => {
  const [rows] = await db.execute('SELECT * FROM children WHERE child_id = ?', [childId]);
  return rows[0];
};

exports.addChild = async (childData) => {
  const { first_name, last_name, middle_name, gender, birthdate, address } = childData;
  const [result] = await db.execute(
    'INSERT INTO children (first_name, last_name, middle_name, gender, birthdate, address) VALUES (?, ?, ?, ?, ?, ?)',
    [first_name, last_name, middle_name, gender, birthdate, address]
  );
  return { child_id: result.insertId, ...childData };
};

exports.updateChild = async (childId, childData) => {
  const { first_name, last_name, middle_name, gender, birthdate, address } = childData;
  await db.execute(
    'UPDATE children SET first_name = ?, last_name = ?, middle_name = ?, gender = ?, birthdate = ?, address = ? WHERE child_id = ?',
    [first_name, last_name, middle_name, gender, birthdate, address, childId]
  );
  return { child_id: childId, ...childData };
}; 