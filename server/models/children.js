"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Child extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  Child.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      middle_name: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
      sex: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["Male", "Female"]],
        },
      },
      birthdate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      purok: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      nutritionalStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      heightCm: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
        },
      },
      weightKg: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
        },
      },
      heightAgeZ: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
        },
      },
      weightHeightZ: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
        },
      },
      measurementDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Active", "Inactive", "Archive"],
        allowNull: false,
        defaultValue: "Active",
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      placeOfBirth: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      heightAtBirth: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: true,
        },
      },
      weightAtBirth: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Child",
      tableName: "children",
      timestamps: false,
    }
  );

  return Child;
};