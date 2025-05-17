const express = require("express");
const router = express.Router();
const {
  getSubjects,
  viewSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subject.controller");

/**
 * @swagger
 * /subjects :
 *   get:
 *     summary: แสดงข้อมูลรายวิชาทั้งหมด
 *     responses:
 *       200:
 *         description: List of subjects
 */
router.get("/", getSubjects);

router.get("/:id", viewSubject);
router.post("/", createSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

module.exports = router;
