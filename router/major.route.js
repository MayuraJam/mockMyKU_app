const express = require("express");
const router = express.Router();

const {
  createMajor,
  getMasMajor,
  viewMajor,
  getDropdownMasMajor
} = require("../controllers/major.controller");

router.get("/", getMasMajor);
router.post("/getDropdown/", getDropdownMasMajor);
router.get("/:id", viewMajor);
router.post("/", createMajor);

module.exports = router;
