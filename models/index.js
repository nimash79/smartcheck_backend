const { Sequelize } = require("sequelize");
require("dotenv").config();

const PersonModel = require("./person.js");
const ReportModel = require("./report.js");
const CameraModel = require("./camera.js");
const DepartmentModel = require("./department.js");
const GateModel = require("./gate.js");
const SettingModel = require("./setting.js");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
  }
);

const Person = PersonModel(sequelize);
const Report = ReportModel(sequelize);
const Camera = CameraModel(sequelize);
const Department = DepartmentModel(sequelize);
const Gate = GateModel(sequelize);
const Setting = SettingModel(sequelize);

// Define relations
Person.hasMany(Report, { foreignKey: "personId" });
Report.belongsTo(Person, { foreignKey: "personId" });
Camera.hasMany(Report, { foreignKey: "cameraId" });
Report.belongsTo(Camera, { foreignKey: "cameraId" });
Gate.hasOne(Department, { foreignKey: "departmentId" });
Gate.belongsTo(Department, { foreignKey: "departmentId" });
Camera.hasOne(Gate, { foreignKey: "gateId" });
Camera.belongsTo(Gate, { foreignKey: "gateId" });
Person.belongsTo(Department, { foreignKey: "departmentId" });
Department.hasMany(Person, { foreignKey: "departmentId" });
Department.belongsTo(Person, {
  as: "manager",
  foreignKey: "managerId",
});
Person.hasOne(Department, {
  as: "managedDepartment",
  foreignKey: "managerId",
});

sequelize.sync();

module.exports = {
  sequelize,
  Person,
  Department,
  Gate,
  Report,
  Camera,
  Setting,
};
