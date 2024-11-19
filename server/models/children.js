"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Child extends Model {
    static associate(models) {
      Child.hasMany(models.ChildImmunizationRecord, {
        foreignKey: "child_id",
        as: "childimmunizationRecords",
      });
      Child.belongsTo(models.HouseholdMember, {
        foreignKey: "member_id",
        as: "householdMember",
      });
    }
  }

  Child.init(
    {
      child_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      
      heightAtBirth: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      weightAtBirth: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      heightCm: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      weightKg: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      heightAgeZ: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      weightAgeZ: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      measurementDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nutritionalStatus: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },  
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Child",
      tableName: "children",
      timestamps: true,
    }
  );

  return Child;
};
