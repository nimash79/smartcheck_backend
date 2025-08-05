const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Report", {
    reportId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    personId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cameraId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    confidenceFactor: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    image_name: {
      type: DataTypes.STRING,
    }
  });
};