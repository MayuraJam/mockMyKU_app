const express = require("express");
const router = express.Router();
const {
    getInstructor,
    viewInstructor,
    createInstructor,
    updateInstructor,
    deleteInstructor,
} = require("../controllers/instructor.controller");

router.get("/", getInstructor);
router.get("/:id", viewInstructor);
router.post("/", createInstructor);
router.put("/:id", updateInstructor);
router.delete("/:id", deleteInstructor);

module.exports = router;
