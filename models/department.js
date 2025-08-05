const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("Department", {
        departmentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        managerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    })
}