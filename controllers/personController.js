const { Op } = require("sequelize");
const { Person, Department } = require("../models");
const { broadcast } = require("../websocket");

exports.getPerson = async (id) => {
  const person = await Person.findByPk(id);
  return person;
};

exports.getPersons = async () => {
  const persons = await Person.findAll({
    where: {
      isManager: false,
    },
    include: [
      {
        model: Department,
        attributes: ["name"],
      },
    ],
  });
  return persons;
};

exports.addPerson = async ({
  name,
  phoneNumber,
  identificationCode,
  departmentId,
  verified,
  face,
  voice,
  isManager,
}) => {
  let person = await Person.findOne({
    where: {
      phoneNumber,
    },
  });
  if (person) return 2;
  person = await Person.findOne({
    where: {
      identificationCode,
    },
  });
  if (person) return 3;
  person = await Person.create({
    name,
    phoneNumber,
    identificationCode,
    departmentId,
    verified,
    face,
    voice,
    isManager,
  });
  broadcast({
    type: "new_face",
    person: {
      personId: person.personId,
      name,
      face,
    },
  });
  broadcast({
    type: "new_voice",
    person: {
      personId: person.personId,
      name,
      voice,
    },
  });
  return 1;
};

exports.editPerson = async ({
  personId,
  name,
  phoneNumber,
  identificationCode,
  departmentId,
  verified,
  face,
  voice,
  isManager,
}) => {
  let person = await Person.findOne({
    where: {
      personId: {
        [Op.not]: personId,
      },
      phoneNumber,
    },
  });
  if (person) return 2;
  person = await Person.findOne({
    where: {
      personId: {
        [Op.not]: personId,
      },
      identificationCode,
    },
  });
  if (person) return 3;
  person = await Person.findByPk(personId);
  if (!person) return 4;
  await person.update({
    name,
    phoneNumber,
    identificationCode,
    departmentId,
    verified,
    face, 
    voice,
    isManager,
  });
  broadcast({
    type: "update_face",
    person: {
      personId: person.personId,
      name,
      face,
    },
  });
  return 1;
};

exports.deletePersons = async ({ personIds }) => {
  await Person.destroy({
    where: {
      personId: {
        [Op.in]: personIds,
      },
    },
  });
  return 1;
};

exports.getManagers = async () => {
  const persons = await Person.findAll({
    where: {
      isManager: true,
    },
    include: [
      {
        model: Department,
        attributes: ["name"],
      },
    ],
  });
  return persons;
};

exports.getFaces = async (req, res) => {
  const persons = await Person.findAll({
    attributes: ["personId", "name", "face"],
  });
  res.sendResponse({ status: 1, persons });
};

exports.getVoices = async (req, res) => {
  const persons = await Person.findAll({
    attributes: ["personId", "name", "voice"],
  });
  res.sendResponse({ status: 1, persons });
};
