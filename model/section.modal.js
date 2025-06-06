const mongoose = require("mongoose");

const SectionScrema = mongoose.Schema({
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Subject"
  },
  Instructors_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "Instructor"
  },
  roomNumber: {
    type: String,
  },
  limitCount: {
    type: Number,
  },
  semester: {
    type: String,
  },
  program: {
    type: String,
  },
  actionStatus: {
    type: String,
  },
  createDate: {
    type: Date,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
  member: [{
  //  studentId : mongoose.Schema.Types.ObjectId,
  type: mongoose.Schema.Types.ObjectId, ref: 'Student'
  }],
  timeSchedule:
    {
      classStart :String,
      classEnd : String,
      classDay : String
    }
  ,
  major : [
    {
      major_id:String,
      level : Number
    }
  ],
  campus_id : {
    type: String,
  },
}
);



const SectionModal = mongoose.model("Section", SectionScrema, "section"); //การ map พร้อมกับชื่อ collection

module.exports = SectionModal;
