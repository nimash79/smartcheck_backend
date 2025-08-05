const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Setting", {
    settingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    deviceIp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deviceName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
