const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const StudentScrema = mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    studentFirstNameEN: {
      type: String,
      match: /^[A-Za-z0-9\s]+$/,
      required: [true, "please enter a FirstName in English"]
    },
    studentLastNameEN: {
      type: String,
      match: /^[A-Za-z0-9\s]+$/,
      required: [true, "please enter a LastName in English"]
    },
    level: {
      type: Number,
    },
    major_id: {
      type: String,
      required: [true, "please choose your major"]
    },
    email: {
      type: String,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email format"],
    },
    telephone: {
      type: String,
      minLength: [10, "Telephone number have length is 10 characters"],
    },
    addmissionYear: {
      type: String,
    },
    AdmissionType: {
      type: String,
    },
    sex: {
      type: String,
    },
    campus_id: {
      type: String,
      required: [true, "please choose your campus"]
    },
    status: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "please enter a Password"],
      minLength: [6, "Minimum password length is 6 characters"],
    },
    role:{
      type:String
    },
    enrollList :[
      {
        type : mongoose.Schema.Types.ObjectId,
        ref :"Enroll"
      }
    ]
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

//ก่อนการบันทึกข้อมูลให้ทำการเข้ารหัสก่อน 
StudentScrema.pre("save",async function (next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password,salt);
  console.log("student about to be created and save",this);
  next();
});

StudentScrema.post("save",function (doc,next){
  console.log("new student was crated & save", doc);
  next();
})

StudentScrema.statics.login = async function (studentId,password){
  const studentUser = await this.findOne({studentId});
  if(!studentUser){
    throw Error("incorrect studentID");
  }
  const matchPassword = await bcrypt.compare(password,studentUser.password)
  if(!matchPassword){
    throw Error("incorrect password");
  }
  return studentUser;
}


const StudentModal = mongoose.model("Student", StudentScrema, "student");
module.exports = StudentModal;
