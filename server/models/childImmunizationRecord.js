"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChildImmunizationRecord extends Model {
    static associate(models) {
      ChildImmunizationRecord.belongsTo(models.Child, {
        foreignKey: "child_id",
        as: "child",
      });
    }
  }

  ChildImmunizationRecord.init(
    {
      record_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      health_center: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      dose_number: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      child_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "children",
          key: "id",
        },
      },
      vaccine_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      dose_description: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      scheduled_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dose_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      administered_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      administered_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      side_effects: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "childImmunizationRecord",
      tableName: "child_immunization_records",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return ChildImmunizationRecord;
};
