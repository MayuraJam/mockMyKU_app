const mongoose = require("mongoose");

const SectionScrema = mongoose.Schema({
  subject_id: {
    type: String,
  },
  Instructors_id: {
    type: String,
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
  member: {
    type: Array,
  },
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
      level : String
    }
  ]
});



const SectionModal = mongoose.model("Section", SectionScrema, "section"); //การ map พร้อมกับชื่อ collection

module.exports = SectionModal;
