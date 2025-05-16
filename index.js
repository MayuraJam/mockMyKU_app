const express = require("express");
const mongoose = require("mongoose");
const subjectRoute = require("./router/subject.route");
const instructorRoute = require("./router/instrutor.route");
const studentRoute = require("./router/student.route");
const sectionRoute = require("./router/section.route");
const MajorRoute = require("./router/major.route");
const UserRoute = require("./router/users.route.js");
const session = require('express-session');
const cors = require("cors");
const connect = require("./configs/databaseConnect.js");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const port = 3000;
const app = express();

//กำหนด middleware ว่าสั่งให้ทำอะไร
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(session({
  secret : "Mayura is dev this app",
  saveUninitialized : false,
  resave: false,
  cookie :{
    maxAge : 60000 * 60,
  }
}));
app.use(cors());
app.use(cookieParser());

//routes
app.use("/subjects", subjectRoute);
app.use("/instructors",instructorRoute);
app.use("/section",sectionRoute);
app.use("/student",studentRoute);
app.use("/major",MajorRoute);
app.use("/authentication",UserRoute);
//อนาคตจะทำการสร้างแบบ form service แลลกรอกหลายหน้า แล้วมีกาเก็บข้อมูลใน session เวลาย้อนกลับมาแล้วข้อมูลยังอยู่ 
//api connect
app.get("/", (req, res) => {
  console.log("seeion :",req.session);
  console.log("session id :",req.session.id);
  req.session.visited = true;
  res.send("Hello learn nodeJS backend 555");
});
app.get("/downloadTextFile", (req, res) => {
  res.download("testExport.txt", function (error) {
    return res.status(404).json({ massage: "don't have file to download" });
  });
});


connect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port`, port);
  });
});
