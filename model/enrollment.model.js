const mongoose = require("mongoose");

const EnrollmentScrema = mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Student"
  },
  section_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Section"
  },
  enrollmentTime : {
    type:Date,
  },
    enrollmentStatus :{
       type:String
    },
    semester :{
       type:String
    },
},{
    versionKey : false,
    Timestamps : true
});

const EnrollmentModal = mongoose.model("Enroll",EnrollmentScrema,"enroll");

module.exports = EnrollmentModal;
