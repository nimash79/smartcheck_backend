const express = require("express");
const {
  addDepartment,
  getDepartments,
  deleteDepartments,
  editDepartment,
  getDepartment,
} = require("../controllers/departmentController");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const departments = await getDepartments();
    res.sendResponse({ status: 1, departments });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.get("/:departmentId", async (req, res) => {
  try {
    const department = await getDepartment(req.params.departmentId);
    res.sendResponse({ status: 1, department });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name, managerId} = req.body;
    if (!name || !managerId)
      return res.sendError("Required parameters", 400);
    const status = await addDepartment({ name, managerId });
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/edit", async (req, res) => {
  try {
    const { departmentId, name, managerId} = req.body;
    if (!departmentId || !name || !managerId)
      return res.sendError("Required parameters", 400);
    const status = await editDepartment({ departmentId, name, managerId });
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err, 500);
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { departmentIds } = req.body;
    const status = await deleteDepartments({departmentIds});
    res.sendResponse({status});
  } catch (err) {
    res.sendError(err, 500);
  }
});

module.exports = router;
