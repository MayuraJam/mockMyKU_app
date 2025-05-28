const mongoose = require("mongoose");

const EnrollmentScrema = mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      require: [true, "Please enter studentID"],
    },
    enrollsectionList: [
      {
        section_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Section",
        },
        enrollmentStatus: String,
        enrollmentTime: Date,
      },
    ],
    semester: {
      type: String,
      require: [true, "Please enter semester"],
    },
    createDate: {
      type: Date,
    },
  },
  {
    versionKey: false,
    Timestamps: true,
  }
);

const EnrollmentModal = mongoose.model("Enroll", EnrollmentScrema, "enroll");

module.exports = EnrollmentModal;
