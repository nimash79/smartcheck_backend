const express = require("express");
const {
  getReports,
  getReportsOfDepartment,
  getReportsOfPerson,
  getReportsOfPersonExcel,
  addReport,
  getReportsOfDepartmentExcel,
} = require("../controllers/reportController");
const { broadcast } = require("../websocket");

const router = express.Router();

router.get("/", getReports);
router.get("/person/:personId", getReportsOfPerson);
router.get("/department/:departmentId", getReportsOfDepartment);
router.get("/person/export/:personId", getReportsOfPersonExcel);
router.get("/department/export/:departmentId", getReportsOfDepartmentExcel);

/**
 * @swagger
 * components:
 *   schemas:
 *     AddReportRequest:
 *       type: object
 *       required:
 *         - personId
 *         - camera_ip
 *         - confidenceFactor
 *       properties:
 *         personId:
 *           type: integer
 *           example: 101
 *         camera_ip:
 *           type: string
 *           example: "192.168.1.10"
 *         confidenceFactor:
 *           type: number
 *           format: float
 *           example: 0.89

 *     Report:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         personId:
 *           type: integer
 *           example: 101
 *         camera_ip:
 *           type: string
 *           example: "192.168.1.10"
 *         confidenceFactor:
 *           type: number
 *           format: float
 *           example: 89
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-07-28T10:30:00Z"

 *     AddReportResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 1
 *         report:
 *           $ref: '#/components/schemas/Report'

 * /api/reports/add:
 *   post:
 *     summary: Add a new report when traffic detected
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddReportRequest'
 *     responses:
 *       200:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddReportResponse'
 *       500:
 *         description: Internal server error
 */

router.post("/add", async (req, res) => {
  try {
    const { personId, camera_url, confidenceFactor } = req.body;
    if (personId == 0) {
      // Detected an unknown face
      res.sendResponse({status: 1});
    } else {
      const report = await addReport({ personId, camera_url, confidenceFactor });
      broadcast({
        type: "traffic_detected",
        ...report,
      });
      res.sendResponse({ status: 1, report });
    }
  } catch (err) {
    res.sendError(err, 500);
  }
});

module.exports = router;
