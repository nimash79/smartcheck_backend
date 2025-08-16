const express = require("express");
const {
  addAlarm,
  getAlarms,
  deleteAlarms,
} = require("../controllers/alarmController");

const router = express.Router();

router.get("/", async (req, res) => {
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

    const result = await getAlarms({ page, limit, offset, sortBy, order, search });

    res.sendResponse({ status: 1, ...result });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/add", async (req, res) => {
  try {
    const { personId, description, file } = req.body;
    const status = await addAlarm({ personId, description, file });
    res.sendResponse(status);
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { alarmIds } = req.body;
    const status = await deleteAlarms({ alarmIds });
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});

module.exports = router;