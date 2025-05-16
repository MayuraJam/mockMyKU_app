const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModal = require("../model/user.model");
const { handleError } = require("../util/utilFunction");

//function not a service 
 const maxAgeToken = 3*24*60*60;

const createToken = (id)=>{
  return jwt.sign({id},'mayura secret',{
    expiresIn: maxAgeToken
 });
 }
// service

const getAllUser = async (req, res) => {
  try {
        const Response = await UserModal.find(); //แสดงข้อมูล
    if (Response.length === 0) {
      console.log("Data not found");
      return res.status(404).json({ massage: "get User not found" });
    } else {
      res.json(Response);
      console.log("data fetch:", Response);
    }
  } catch (error) {
    res.status(500).json({
      error: error.message || error,
    });
    handleError(error);
  }
};
const signUp = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      error: error.message || error,
    });
    // handleError(error);
  }
};

const login = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      error: error.message || error,
    });
    // handleError(error);
  }
};

const createNewUser = async (req, res) => {
  const reqBody = req.body;
  const { email, password } = reqBody;
  try {
    //ทำการตรวจสอบว่ามีการใส่ email ที่เคยสร้างไว้แล้วหรือยัง
    const user = await UserModal.create({ email, password });
    const token = createToken(user._id);

    //1. กรณีมีหน้าบ้าน เพื่อส่งตัว Token -> cookie
    res.cookie('jwt',token,{
      httpOnly : true, //ถ้าเป็น true -> cookie ใช้ได้เฉพาะ Http (client อ่านไม่ได้) : boolean
      maxAge : maxAgeToken*1000 //อายุของ cookie (milisecont) : number
    })
    //2. ไม่มีหน้าบ้าน
    res.status(201).json({
      massage: "Create new User success!",
      userResponse: user,
      token : token
    });
  } catch (error) {
    const errMassage = handleError(error);
    res.status(500).json(errMassage);
  }
};

const AuthenCurrentUser = async (req, res) => {
  const reqBody = req.body;
  const { email, password } = reqBody;
  try {
  } catch (error) {
    const errMassage = handleError(error);
    res.status(500).json(errMassage);
  }
};

const logout = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      error: error.message || error,
    });
    // handleError(error);
  }
};
module.exports = {
  signUp,
  login,
  createNewUser,
  AuthenCurrentUser,
  logout,
  getAllUser
};
