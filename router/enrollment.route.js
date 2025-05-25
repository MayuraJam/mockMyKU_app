const express = require("express")
const router = express.Router();
const {createEnrollment,getEnrolllist,addNewEnroll,withdrawOrDropSection} = require("../controllers/enrollment.controller");

router.get("/",getEnrolllist);
router.post("/",createEnrollment);
router.put("/add/:id",addNewEnroll);
router.put("/withdrawOrDrop/:id",withdrawOrDropSection);


module.exports = router