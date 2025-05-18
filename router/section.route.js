const express = require("express");
const router = express.Router();
const {
  getSection,
  viewSection,
  createSection,
  updateSection,
  deleteSection,
  viewSectionByFilter,
  removeSectionMajor,
  addSectionMajor,
  getMemberFromSection
} = require("../controllers/section.controller");

router.get("/", getSection);
router.get("/filter/", viewSectionByFilter);
router.get("/:id", viewSection);
router.post("/getMember/",getMemberFromSection);
router.post("/", createSection);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);
router.put("/removeSectionMajor/:id", removeSectionMajor);
router.put("/addSectionMajor/:id", addSectionMajor);
module.exports = router;
