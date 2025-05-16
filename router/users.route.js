const express = require("express");
const router = express.Router();
const {
signUp,
AuthenCurrentUser,
createNewUser,
login,
logout,
getAllUser
} = require("../controllers/user.controller");

//Example Tutorial;
router.get("/signup", signUp);
router.post("/signup",createNewUser);
router.get("/login", login);
router.post("/login", AuthenCurrentUser); //ให้แสดงเป็นข้อความ console.log ว่าเข้าสู่ระบบสำเร็จ
router.get("/logout", logout); //ให้แสดงเป็นข้อความ console.log ว่าออกจากระบบสำเร็จ
router.get("/allUsers", getAllUser);


module.exports = router;