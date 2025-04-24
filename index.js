const express = require("express");
const mongoose = require("mongoose");
const SubjectModal = require("./model/subject.modal");
const { sendLineNotificate } = require("./services/sendMessageToLine");
const subjectRoute = require("./router/subject.route");
const instructorRoute = require("./router/instrutor.route");
const sectionRoute = require("./router/section.route");


require("dotenv").config();

const DBurl = process.env.MONGO_URI;
const port = 3000;
const app = express();
//mongoDB connect
mongoose
  .connect(DBurl)
  .then(() => console.log("Mongo is connected"))
  .catch((err) => console.error("Mongo connection fail :", err));

//กำหนด middleware ว่าสั่งให้ทำอะไร
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

//routes
app.use("/subjects", subjectRoute);
app.use("/instructors",instructorRoute);
app.use("/section",sectionRoute);

//api connect
app.get("/", (req, res) => {
  res.send("Hello learn nodeJS backend 555");
});
app.get("/downloadTextFile", (req, res) => {
  res.download("testExport.txt", function (error) {
    return res.status(404).json({ massage: "don't have file to download" });
  });
});

app.listen(port, () => {
  console.log("Server is running on server 3000");
});
