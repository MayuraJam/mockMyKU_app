const express = require("express");
const router = express.Router();
const {
LoginPost,
createNewUser,
logout,
getAllUser,
deleteUser,
LoginToMyKU
} = require("../controllers/user.controller");
const { requireAuth } = require("../middleware/authMiddleware");

//Example Tutorial ;
router.post("/signup",createNewUser);
router.post("/login",LoginPost); //ให้แสดงเป็นข้อความ console.log ว่าเข้าสู่ระบบสำเร็จ
router.get("/logout", logout); //ให้แสดงเป็นข้อความ console.log ว่าออกจากระบบสำเร็จ
router.get("/allUsers", getAllUser);
router.delete("/deleteUser/:id",deleteUser);
router.post("/loginToMyKU",LoginToMyKU);

module.exports = router;