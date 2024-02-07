"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class repair extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      repair.belongsTo(models.motor, { foreignKey: "motorId" });
      repair.belongsTo(models.status, { foreignKey: "statusId" });
    }
  }
  repair.init(
    {
      statusId: DataTypes.INTEGER,
      order_date: DataTypes.DATE,
      finish_date: DataTypes.DATE,
      motorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "repair",
    }
  );
  return repair;
};
