const { Op } = require("sequelize");
const { Department, Person } = require("../models");

exports.addDepartment = async ({ name, managerId }) => {
  let department = await Department.findOne({
    where: { name },
  });
  if (department) return 2;
  const person = await Person.findByPk(managerId);
  if (!person) return 3;
  department = await Department.create({ name, managerId });
  person.departmentId = department.departmentId;
  await person.save();
  return 1;
};

exports.getDepartments = async () => {
  const departments = await Department.findAll({
    include: [
      {
        model: Person,
        as: "manager",
        attributes: ["personId", "name", "phoneNumber"],
      },
    ],
  });
  return departments;
};

exports.deleteDepartments = async ({departmentIds}) => {
  await Department.destroy({
    where: {
      departmentId: {
        [Op.in]: departmentIds,
      },
    },
  });
  return 1;
};

exports.editDepartment = async ({ departmentId, name, managerId }) => {
  let department = await Department.findOne({
    where: {
      departmentId: {
        [Op.not]: departmentId,
      },
      name,
    },
  });
  if (department) return 2;
  department = await Department.findByPk(departmentId);
  if (!department) return 4;
  const person = await Person.findByPk(managerId);
  if (!person) return 3;
  await department.update({ name, managerId });
  person.departmentId = department.departmentId;
  await person.save();
  return 1;
};

exports.getDepartment = async (departmentId) => {
  const department = await Department.findByPk(departmentId);
  return department;
};
