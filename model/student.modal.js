const mongoose = require("mongoose");

const StudentScrema = mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  studentFirstNameTH: {
    type: String,
    required: true,
  },
  studentLastNameTH: {
    type: String,
    required: true,
  },
  studentFirstNameEN: {
    type: String,
    required: true,
  },
  studentLastNameEN: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  major_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  telephone: {
    type: String,
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
  birthDate: {
    type: String,
  },
  createDate: {
    type: Date,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
  campus_id: {
    type: String,
  },
  status: {
    type: String,
  },
});
const StudentModal = mongoose.model("Student", StudentScrema, "student");
module.exports = StudentModal;
