"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class vaccineDose extends Model {
        static associate(models) {
          vaccineDose.belongsTo(models.childImmunizationRecord, {
            foreignKey: "record_id", // Ensure foreignKey matches the field in childImmunizationRecord
          });
        }
      }
      

  vaccineDose.init(
    {
      dose_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      record_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ChildImmunizationRecord",
          key: "record_id",
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
      modelName: "vaccineDose",
      tableName: "vaccineDose",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return vaccineDose;
}; 