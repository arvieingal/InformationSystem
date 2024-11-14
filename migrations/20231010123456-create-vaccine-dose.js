"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("vaccineDose", {
      dose_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      record_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ChildImmunizationRecord",
          key: "record_id",
        },
      },
      vaccine_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      dose_description: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      scheduled_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      administered_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      administered_by: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      side_effects: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("vaccineDose");
  },
}; 