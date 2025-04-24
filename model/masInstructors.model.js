const mongoose = require("mongoose");

const InstructorScrema = mongoose.Schema({
    instructorsNameTH: {
        type: String,
        required: true,
      },
      instructorsNameEN: {
        type: String,
        required: true,
      },
      department: {
        type: String,
      },
      position: {
        type: String,
      },  
      email: {
        type: String,
      },
      telephone: {
        type: String,
      },
      campus_id: {
        type: String,
      },
      createDate :{
        type:Date,
      },
      updateDate :{
        type:Date,
        default:Date.now
      },
})

const InstructorModal = mongoose.model("Instructor", InstructorScrema, "instructor"); //การ map พร้อมกับชื่อ collection

module.exports = InstructorModal;