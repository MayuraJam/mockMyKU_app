const express = require("express");
const router = express.Router();
const {
logIn
} = require("../controllers/user.controller");


router.post("/", logIn);


module.exports = router;