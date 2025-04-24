const mongoose = require("mongoose");
const { ActionStatus, SubjectType } = require("../enum/subjectEnum");

//ข้อมูล master
const SubjectScrema = mongoose.Schema(
  {
    subjectID: {
      type: String,
      required: true,
    },
    subjectNameTH: {
      type: String,
      required: [true, "Please enter the Thai subject name"],
    },
    subjectNameEN: {
      type: String,
      required: [true, "Please enter the English subject name"],
    },
    description:{
      type: String,
      default:"-"
    },
    prerequisite:{
      type: String,
      default:"-"
    },
    credit: {
      type: Number,
      default: 0,
    },
    lectureTime: {
      type: Number,
      default: 0,
    },
    labTime: {
      type: Number,
      default: 0,
    },
    selfLearningTime: {
      type: Number,
      default: 0,
    },
    actionStatus: {
      type: String,
      default: ActionStatus.OPEN
    },
    subjectType :{
      type:String,
      default: SubjectType.LECTUTE
    },
    major_id :{
      type:String,
      default:"-"
    },
    campus_id :{
      type:String,
      default:"01"
    },
    createDate :{
      type:Date,
    },
    updateDate :{
      type:Date,
      default:Date.now
    },
  }
);

// modal
const SubjectModal = mongoose.model("Subject", SubjectScrema, "subject"); //การ map พร้อมกับชื่อ collection

module.exports = SubjectModal;
