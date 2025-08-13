const { Op } = require("sequelize");
const ExcelJS = require("exceljs");

const { Report, Person, Department, Camera, Gate } = require("../models");
const { persianDateToUTC, toShamsi } = require("../utils/helper");

exports.getReports = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? "ASC" : "DESC";

    // Searching
    const search = req.query.search || "";

    const reports = await Report.findAndCountAll({
      where: {},
      include: [
        {
          model: Person,
          attributes: ["name", "phoneNumber"],
          where: search
            ? {
              [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { phoneNumber: { [Op.iLike]: `%${search}%` } },
              ],
            }
            : undefined,
          include: [
            {
              model: Department,
              attributes: ["name"],
              where: search
                ? {
                  name: { [Op.iLike]: `%${search}%` },
                }
                : undefined,
            },
          ],
        },
        {
          model: Camera,
          attributes: ["name", "direction"],
          include: [
            {
              model: Gate,
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [[sortBy, order]],
      limit,
      offset,
    });

    res.sendResponse({
      totalItems: reports.count,
      totalPages: Math.ceil(reports.count / limit),
      currentPage: page,
      reports: reports.rows,
    });
  } catch (error) {
    console.error("Error in getReports:", error);
    res.sendError("Internal Server Error");
  }
};

exports.getReportsOfPerson = async (req, res) => {
  try {
    const { personId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filtering
    const from = req.query.from ? persianDateToUTC(req.query.from) : new Date("1970-01-01");
    const to = req.query.to ? persianDateToUTC(req.query.to).setHours(23, 59) : new Date();

    // Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? "ASC" : "DESC";

    // Searching
    const search = req.query.search || "";

    const reports = await Report.findAndCountAll({
      where: {
        personId,
        createdAt: {
          [Op.between]: [from, to]
        }
      },
      include: [
        {
          model: Person,
          attributes: ["name", "phoneNumber"],
          where: search
            ? {
              [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { phoneNumber: { [Op.iLike]: `%${search}%` } }
              ]
            }
            : undefined,
          include: [
            {
              model: Department,
              attributes: ["name"],
              where: search
                ? { name: { [Op.iLike]: `%${search}%` } }
                : undefined
            }
          ]
        },
        {
          model: Camera,
          attributes: ["name", "direction"],
          include: [
            {
              model: Gate,
              attributes: ["name"]
            }
          ]
        }
      ],
      order: [[sortBy, order]],
      limit,
      offset
    });

    res.sendResponse({
      totalItems: reports.count,
      totalPages: Math.ceil(reports.count / limit),
      currentPage: page,
      reports: reports.rows
    });
  } catch (error) {
    console.error("Error in getReportsOfPerson:", error);
    res.sendError("Internal Server Error");
  }
};


exports.getReportsOfDepartment = async (req, res) => {
  try {
    // Parameters
    const { departmentId } = req.params;
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Filtering
    const from = req.query.from ? persianDateToUTC(req.query.from) : new Date("1970-01-01");
    const to = req.query.to ? persianDateToUTC(req.query.to).setHours(23, 59) : new Date();

    // Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? "ASC" : "DESC";

    // Searching
    const search = req.query.search || "";

    const reports = await Report.findAndCountAll({
      where: {
        createdAt: {
          [Op.between]: [from, to]
        }
      },
      include: [
        {
          model: Person,
          attributes: ["name", "phoneNumber"],
          where: search
            ? {
              [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { phoneNumber: { [Op.iLike]: `%${search}%` } },
              ],
            }
            : undefined,
          include: [
            {
              model: Department,
              attributes: ["name"],
              where: {
                ...(search && {
                  [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { phoneNumber: { [Op.iLike]: `%${search}%` } },
                  ],
                }),
                ...(departmentId && { departmentId }),
              },
            },
          ],
        },
        {
          model: Camera,
          attributes: ["name", "direction"],
          include: [
            {
              model: Gate,
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [[sortBy, order]],
      limit,
      offset,
    });

    res.sendResponse({
      totalItems: reports.count,
      totalPages: Math.ceil(reports.count / limit),
      currentPage: page,
      reports: reports.rows,
    });
  } catch (error) {
    console.error("Error in getReportsOfDepartment:", error);
    res.sendError("Internal Server Error");
  }
};

exports.getReportsOfPersonExcel = async (req, res) => {
  try {
    const {personId} = req.params;

    // Filtering
    const from = req.query.from ? persianDateToUTC(req.query.from) : new Date("1970-01-01");
    const to = req.query.to ? persianDateToUTC(req.query.to).setHours(23, 59) : new Date()

    // Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? "ASC" : "DESC";

    // Searching
    const search = req.query.search || "";

    const reports = await Report.findAll({
      where: {
        personId,
        createdAt: {
          [Op.between]: [from, to]
        }
      },
      include: [
        {
          model: Person,
          attributes: ["name", "phoneNumber"],
          where: search
            ? {
              [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { phoneNumber: { [Op.iLike]: `%${search}%` } }
              ]
            }
            : undefined,
          include: [
            {
              model: Department,
              attributes: ["name"],
              where: search
                ? { name: { [Op.iLike]: `%${search}%` } }
                : undefined
            }
          ]
        },
        {
          model: Camera,
          attributes: ["name", "direction"],
          include: [
            {
              model: Gate,
              attributes: ["name"]
            }
          ]
        }
      ],
      order: [[sortBy, order]],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reports");

    worksheet.columns = [
      { header: "Person Name", key: "personName", width: 30 },
      { header: "Phone Number", key: "phoneNumber", width: 20 },
      { header: "Department", key: "department", width: 20 },
      { header: "Camera Name", key: "cameraName", width: 20 },
      { header: "Camera Direction", key: "cameraDirection", width: 15 },
      { header: "Gate", key: "gate", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 }
    ];

    reports.forEach((report) => {
      worksheet.addRow({
        personName: report.Person?.name || "",
        phoneNumber: report.Person?.phoneNumber || "",
        department: report.Person?.Department?.name || "",
        cameraName: report.Camera?.name || "",
        cameraDirection: report.Camera?.direction || "",
        gate: report.Camera?.Gate?.name || "",
        createdAt: toShamsi(report.createdAt)
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=reports_${Date.now()}.xlsx`
    );

    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error exporting reports Excel:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getReportsOfDepartmentExcel = async (req, res) => {
  try {
    const {departmentId} = req.params;

    // Filtering
    const from = req.query.from ? persianDateToUTC(req.query.from) : new Date("1970-01-01");
    const to = req.query.to ? persianDateToUTC(req.query.to).setHours(23, 59) : new Date()

    // Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? "ASC" : "DESC";

    // Searching
    const search = req.query.search || "";

    const reports = await Report.findAll({
      where: {
        createdAt: {
          [Op.between]: [from, to]
        }
      },
      include: [
        {
          model: Person,
          attributes: ["name", "phoneNumber"],
          where: search
            ? {
              [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { phoneNumber: { [Op.iLike]: `%${search}%` } },
              ],
            }
            : undefined,
          include: [
            {
              model: Department,
              attributes: ["name"],
              where: {
                ...(search && {
                  [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { phoneNumber: { [Op.iLike]: `%${search}%` } },
                  ],
                }),
                ...(departmentId && { departmentId }),
              },
            },
          ],
        },
        {
          model: Camera,
          attributes: ["name", "direction"],
          include: [
            {
              model: Gate,
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [[sortBy, order]],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reports");

    worksheet.columns = [
      { header: "Person Name", key: "personName", width: 30 },
      { header: "Phone Number", key: "phoneNumber", width: 20 },
      { header: "Department", key: "department", width: 20 },
      { header: "Camera Name", key: "cameraName", width: 20 },
      { header: "Camera Direction", key: "cameraDirection", width: 15 },
      { header: "Gate", key: "gate", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 }
    ];

    reports.forEach((report) => {
      worksheet.addRow({
        personName: report.Person?.name || "",
        phoneNumber: report.Person?.phoneNumber || "",
        department: report.Person?.Department?.name || "",
        cameraName: report.Camera?.name || "",
        cameraDirection: report.Camera?.direction || "",
        gate: report.Camera?.Gate?.name || "",
        createdAt: toShamsi(report.createdAt)
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=reports_${Date.now()}.xlsx`
    );

    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error exporting reports Excel:", error);
    res.status(500).send("Internal Server Error");
  }
};


exports.addReport = async ({ personId, camera_url, confidenceFactor }) => {
  try {
    const camera = await Camera.findOne({
      where: {
        ip: camera_url,
      },
    });
    const newReport = await Report.create({
      personId,
      cameraId: camera.cameraId,
      confidenceFactor,
    });

    const fullReport = await Report.findOne({
      where: { reportId: newReport.reportId },
      include: [
        {
          model: Person,
          attributes: ["name", "phoneNumber"],
          include: [
            {
              model: Department,
              attributes: ["name"],
            },
          ],
        },
        {
          model: Camera,
          attributes: ["name", "direction"],
          include: [
            {
              model: Gate,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    return fullReport.get({ plain: true });
  } catch (error) {
    console.error("Error in addReport:", error);
  }
};
