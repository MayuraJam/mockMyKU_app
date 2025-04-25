const InstructorModal = require("../model/masInstructors.model");

const getInstructor = async (req, res) => {
  try {
    const response = await InstructorModal.find(); //แสดงข้อมูล
    if (response.length === 0) {
      console.log("Data not found");
      return res.status(404).json({ massage: "get instructor not found" });
    } else {
      res.json(response);
      console.log("data fetch:", response);
    }
  } catch (error) {
    res.status(500).json({ massage: "get instructor not found" });
  }
};

const viewInstructor = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await InstructorModal.findById(id);
    if (response.length === 0) {
      return res.status(404).json({ massage: "get instructor not found" });
    }
    res.status(200).json({ response });
  } catch (error) {
    console.error("❌ ERROR at //viewInstructor/ :", error.message || error);
    res.status(500).json({
      error: error.message || error,
    });
  }
};

const createInstructor = async (req, res) => {
  try {
    //สร้างรหัสวิชา เลือกจากหน้าบ้าน => ได้เป็นหมายเลขออกมาประกอบกัน
    const newData = new InstructorModal();
    const requestBody = req.body;
    newData.instructorsNameTH = requestBody.instructorsNameTH;
    newData.instructorsNameEN = requestBody.instructorsNameEN;
    newData.department = requestBody.department;
    newData.position = requestBody.position;
    newData.email = requestBody.email;
    newData.telephone = requestBody.telephone;
    newData.campus_id = requestBody.campus_id;
    newData.room = requestBody.room;
    newData.createDate = new Date();
    newData.updateDate = new Date();
    await newData.save();
    res.status(200).json({ newData });
  } catch (error) {
    console.error("❌ ERROR at /createInstructor:", error.message || error);

    res.status(500).json({
      message: "create new instructor fail",
      error: error.message || error,
    });
  }
};

const updateInstructor = async (req, res) => {
  const { id } = req.params;
  try {
    const requestBody = req.body;
    const updateData = await InstructorModal.findByIdAndUpdate(
      id,
      {
        instructorsNameTH: requestBody.instructorsNameTH,
        instructorsNameEN: requestBody.instructorsNameEN,
        department: requestBody.department,
        position: requestBody.position,
        email: requestBody.email,
        telephone: requestBody.telephone,
        campus_id: requestBody.campus_id,
        room : requestBody.room,
        updateDate: new Date(),
      },
      {
        new: true, // ให้คืนค่าที่อัปเดตแล้ว
        runValidators: true, // ให้ตรวจสอบ schema validation ด้วย
      }
    );

    if (!updateData) {
      return res.status(404).json({ massage: `update intructor fail ${id}` });
    }
    //ดึงข้อมูลที่อัปเดตใหม่
    const getUpdateData = await InstructorModal.findById(id);
    res.status(200).json(getUpdateData);
  } catch (error) {
    console.error("❌ ERROR at /updateInstructor :", error.message || error);
    res.status(500).json({
      massage: error.message || error,
    });
  }
};

const deleteInstructor = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await InstructorModal.findByIdAndDelete(id);
    if (!subject) {
      return res
        .status(404)
        .json({ massage: `this ${id} not found to delete` });
    }
    res
      .status(200)
      .json({ massage: `delete instructor id : ${id} successfully` });
  } catch (error) {
    console.error("❌ ERROR at /deleteInstructor :", error.message || error);
    res.status(500).json({
      massage: error.message || error,
    });
  }
};

module.exports = {
  getInstructor,
  viewInstructor,
  createInstructor,
  updateInstructor,
  deleteInstructor,
};
