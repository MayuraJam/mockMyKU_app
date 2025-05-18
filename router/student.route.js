const express = require("express");
const router = express.Router();

const {
  createStudent,
  changeToGrduate,
  updateStudent,
  getStudent,
  viewStudent
} = require("../controllers/student.controller");

router.get("/", getStudent);
router.get("/:id", viewStudent);
router.post("/", createStudent);
router.put("/graduateStatus/:id", changeToGrduate);
router.put("/:id", updateStudent);

module.exports = router;
