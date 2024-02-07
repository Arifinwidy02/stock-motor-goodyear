"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class motor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      motor.belongsTo(models.status, { foreignKey: "statusId" });
      motor.hasMany(models.repair, { foreignKey: "motorId" });
      // define association here
    }
  }
  motor.init(
    {
      id_number: DataTypes.STRING,
      remarks: DataTypes.STRING,
      manufacturer: DataTypes.STRING,
      voltage: DataTypes.INTEGER,
      hp: DataTypes.INTEGER,
      ac_dc: DataTypes.STRING,
      statusId: DataTypes.INTEGER,
      imgUrl: DataTypes.STRING,
      isHiddenMotor: DataTypes.BOOLEAN,
      qrcode: DataTypes.STRING,
      // barcode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "motor",
    }
  );
  return motor;
};
