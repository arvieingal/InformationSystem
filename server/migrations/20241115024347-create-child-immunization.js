'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('child_immunization_records', {
      child_id: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        allowNull: false,
        // Added reference to the children table
        references: {
          model: 'children', // Ensure this matches the table name
          key: 'child_id', // Ensure this matches the primary key in the referenced table
        },
      },
      
      // Add the new fields from the model
      record_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      dose_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      health_center: {
        type: Sequelize.STRING(100),
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
    await queryInterface.dropTable('child_immunization_records');
  },
};