const jwt = require("jsonwebtoken");
const { login } = require("../controllers/user.controller");
const UserModal = require("../model/user.model");
require("dotenv").config();

const requireAuth = (req, res, next) => {
  const token = req.cookie.jwt; //ดึง jwt จาก cookie

  // check json web token exists & verified
  if (token) {
    //ถ้ามี token ให้ทำการตรวจสอบ token นั้น กับในระบบ
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        //กลับไปที่หน้า login เดิม
      } else {
        console.log("ตรวจสอบ token สำเร็จ", decodedToken); //ได้หมายเลข id คืน
        //การ redirec ฝั่งหน้าบ้าน
        next();
      }
    });
  } else {
    console.log("สู่หน้า login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookie.jwt;
  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.locals.user = null;
          next();
        } else {
          console.log("ตรวจสอบ token สำเร็จ", decodedToken); //ได้หมายเลข id คืน
          let user = await UserModal.findById(decodedToken.id); //ข้อมูลของ user
          res.locals.user = user;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth,checkUser };
