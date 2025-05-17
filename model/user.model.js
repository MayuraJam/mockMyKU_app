const { mongoose } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserScrema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "please enter an Email"],
      unigue: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email format"],
    },
    password: {
      type: String,
      required: [true, "please enter a Password"],
      minLength: [6, "Minimum password length is 6 characters"],
    },
    passwordFromClient: {
      type: String,
      minLength: [6, "Minimum password length is 6 characters"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
//mongoose hook
//middleWare fire a function after doc saved to db;
UserScrema.post("save", function (doc, next) {
  console.log("new user was crated & save", doc);
  next(); //ฟังก์ชันสำหรับส่งต่อการทำงานใน middleware ถ้าไม่มีคำสั่งนี้ ระบบอาจ ค้างอยู่ โดยไม่มีการส่ง response กลับ → ทำให้ client รอไม่จบ
});

//ก่อนการสร้าง new user ให้ middleware ทำอะไร
UserScrema.pre("save", async function (next) {
  //เหมาะสำหรับกิจกกรมที่ต้องการทำก่อนการสร้างข้อมูลใหม่
  //เหมาะสำหรับการเข้ารหัสในส่วนของข้อมูลสำคัญ ก่อนการสร้างข้อมูลใหม่ เช่นการ hashing password
  //this คือการอ้างอิงถึงข้อมูลปัจจุบันของเราที่กำลังจะสร้าง
  //ทำการตรวจสอบว่ามีการใส่ email ที่เคยสร้างไว้แล้วหรือยัง

  const salt = await bcrypt.genSalt();
  console.log("Before Hash:", this.password);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("After Hash:", this.password);
  //นำรหัสผ่าน ทำการเข้ารหัส bcrypt
  console.log("user about to be created and save", this);
  next();
});

//static method to login user ใช้ในการเปรียบข้อมูลที่เข้ามากับข้อมูลที่อยู่ในฐานข้อมูล กรณีต้องทำการตรวจชุดข้อมูลหลายตัว
UserScrema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }); //ตรวจสอบ email
  if (!user) {
    throw Error("Incorrect email");
  }
  console.log("User password:", user.password);

  const match = await bcrypt.compare(password, user.password);
  console.log("campare password:", match);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

const UserModal = mongoose.model("User", UserScrema, "user");
module.exports = UserModal;
