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
        references: {
          model: "household_member",
          key: "first_name",
        },
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "household_member",
          key: "last_name",
        },
      },
      middle_name: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "household_member",
          key: "middle_name",
        },
      },
      suffix: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "household_member",
          key: "gender",
        },
      },
      birthdate: {
        type: Sequelize.DATE,
        allowNull: false,
        references: {
          model: "household_member",
          key: "birthdate",
        },
      },
      barangay: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mothers_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "household_head",
          key: "relationship",
        },
      },
      fathers_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "household_head",
          key: "relationship",
        },
      },
      family_number: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "household_head",
          key: "family_number",
        },
      },
      sitio_purok: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "household_member",
          key: "sitio_purok",
        },
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

    await queryInterface.addConstraint("children", {
      fields: ["address"], // This will be the field that holds the reference
      type: "foreign key",
      name: "fk_children_address", // Custom name for the constraint
      references: {
        table: "household_member",
        fields: ["barangay", "city"], // Composite key reference
      },
      onDelete: "cascade", // Optional: define what happens on delete
      onUpdate: "cascade", // Optional: define what happens on update
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the composite foreign key constraint
    await queryInterface.removeConstraint("children", "fk_children_address");
    await queryInterface.dropTable("children");
  },
};
