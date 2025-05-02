const express = require("express");
const router = express.Router();

const {
  createStudent,
  deleteStudent,
  updateStudent,
  getStudent,
  viewStudent
} = require("../controllers/student.controller");
router.get("/", getStudent);
router.get("/:id", viewStudent);
router.post("/", createStudent);
router.put("/delete/:id", deleteStudent);
router.put("/:id", updateStudent);

module.exports = router;
