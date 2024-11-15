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
      middle_name: {
        type: Sequelize.STRING,
        allowNull: true,
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
      purok: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nutritionalStatus: {
        type: Sequelize.STRING,
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
      heightAgeZ: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      weightHeightZ: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      measurementDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["Active", "Inactive", "Archive"],
        allowNull: false,
        defaultValue: "Active",
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      placeOfBirth: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      heightAtBirth: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      weightAtBirth: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("children");
  },
};