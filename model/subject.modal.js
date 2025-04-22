const mongoose = require("mongoose");

const SubjectScrema = mongoose.Schema(
  {
    subjectID: String,
    subjectNameTH: {
      type: String,
      required: [true, "Please enter the Thai subject name"],
    },
    subjectNameEN: {
      type: String,
      required: [true, "Please enter the English subject name"],
    },
    time: {
      type: Number,
      default: 0,
    },
    lab: {
      type: Number,
      default: 0,
    },
    selfLearning: {
      type: Number,
      default: 0,
    },
  },
  {
    Timestamp: true,
  }
);

// modal
const SubjectModal = mongoose.model("Subject", SubjectScrema,"subject"); //การ map พร้อมกับชื่อ collection

module.exports = SubjectModal;
