"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("children", {
      child_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sex: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      birthdate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      heightCm: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      weightKg: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      nutritionalStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("children");
  },
};