const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModal = require("../model/user.model");
const { handleError } = require("../util/utilFunction");
const StudentModal = require("../model/student.modal");

//function not a service
const maxAgeToken = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAgeToken,
  });
};
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

const createNewUser = async (req, res) => {
  const reqBody = req.body;
  const { email, password } = reqBody;
  try {
    const existingUser = await UserModal.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        massage: "Email already exists",
      });
    }
    const user = await UserModal.create({
      email,
      password,
      passwordFromClient: password,
    });
    const token = createToken(user._id);

    //1. กรณีมีหน้าบ้าน เพื่อส่งตัว Token -> cookie
    res.cookie("jwt", token, {
      httpOnly: true, //ถ้าเป็น true -> cookie ใช้ได้เฉพาะ Http (client อ่านไม่ได้) : boolean
      maxAge: maxAgeToken * 1000, //อายุของ cookie (milisecont) : number
    });
    //2. ไม่มีหน้าบ้าน
    res.status(201).json({
      massage: "Create new User success!",
      userResponse: user,
      token: token,
    });
    //หรือทำการเก็บ token ใน redis
  } catch (error) {
    const errMassage = handleError(error);
    res.status(500).json({ errMassage });
  }
};

const LoginPost = async (req, res) => {
  const reqBody = req.body;
  const { email, password } = reqBody;
  try {
    const user = await UserModal.login(email, password);
    console.log(user);
    //อันนี้เรียกว่า instance method เพื่อทำการใช้ method login ด้วย email,password
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true, //ถ้าเป็น true -> cookie ใช้ได้เฉพาะ Http (client อ่านไม่ได้) : boolean
      maxAge: maxAgeToken * 1000, //อายุของ cookie (milisecont) : number
    });
    res.status(200).json({
      user: user, //ข้อมูลทั้งหมดของเรา
      token: token,
      massage: "Welcome to Homepage <3 ",
    });
  } catch (error) {
    const errMassage = handleError(error);
    res.status(400).json(errMassage);
  }
};

//เข้าสู่ระบบได้ทั้งนิสิตและอาจารย์
const LoginToMyKU = async (req, res) => {
  const reqBody = req.body;
  const { officialID, password, role } = reqBody;
  try {
    if (role === "Student") {
      const user = await StudentModal.login(officialID, password);
      console.log("data:", user);
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAgeToken * 1000,
      });
      res.status(200).json({
        user: user, //ข้อมูลทั้งหมดของเรา
        massage: "Welcome to Student homepage <3 ",
      });
    }
    else{
    res.status(400).json({ message: "ไม่มีผู้เข้าใช้งานในตำแหน่งนี้" });
    }
  } catch (error) {
    res.status(400).json({ message: "ไม่สามารถ login ได้" });
  }
};

// ทำการล้าง token jwt ออก
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.json({ message: "log out success!" });
  } catch (error) {
    res.status(500).json({
      error: error.message || error,
    });
  }
};

const forgotPassword = async (req,res)=>{
  //ค่อยกลับมาทำในส่วนนี้
}

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModal.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ massage: `this ${id} not found to delete` });
    }
    res.status(200).json({ massage: `delete user id : ${id} successfully` });
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({
      massage: error.message || error,
    });
  }
};

module.exports = {
  LoginPost,
  createNewUser,
  logout,
  getAllUser,
  deleteUser,
  createToken,
  maxAgeToken,
  LoginToMyKU
};
