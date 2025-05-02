const express = require("express");
const router = express.Router();

const {
  createMajor,
  getMasMajor,
  viewMajor,
} = require("../controllers/major.controllor");

router.get("/", getMasMajor);
router.get("/:id", viewMajor);
router.post("/", createMajor);

module.exports = router;
