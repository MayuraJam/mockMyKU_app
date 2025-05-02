const mongoose = require("mongoose");

const MajorScrema = mongoose.Schema({
  major_Id: {
    type: String,
  },
  majorNameTH: {
    type: String,
    required: true,
  },
  majorNameEN: {
    type: String,
    required: true,
  },
  degree : {
    type: String,
  },
  faculty: {
    type: String,
  },
  instructorMamber: {
    type: Array,
  },
  socialContact: [
    {
      contactName: String,
      link : String
    },
  ],
  telephone: {
    type: String,
  },
  campus_id: {
    type: String,
  },
  address: {
    type: String,
  },
  activeStatus: {
    type: String,
  },
  program: {
    type: String,
  },
  createDate: {
    type: Date,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
});

const MajorModal = mongoose.model("Major", MajorScrema, "major");

module.exports = MajorModal;
