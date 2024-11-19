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
      member_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'household_member',
          key: 'member_id'
        },
        allowNull: false,
      },
      heightAtBirth: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      weightAtBirth: {
        type: Sequelize.FLOAT,
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
      weightAgeZ: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },  
      weightHeightZ: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      measurementDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      nutritionalStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["Active", "Inactive", "Archive"],
        allowNull: false,
        defaultValue: "Active",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("children");
  },
};
