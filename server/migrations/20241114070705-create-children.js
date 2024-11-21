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
      resident_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "resident", // Ensure this table exists
          key: "resident_id", // Ensure this is a primary key in the resident table
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      suffix: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sex: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      birthdate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      barangay: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mothers_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fathers_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      family_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sitio_purok: {
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
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("children");
  },
};