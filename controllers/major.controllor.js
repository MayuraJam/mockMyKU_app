const MajorModal = require("../model/major.model");

const getMasMajor = async (req, res) => {
  try {
    const response = await MajorModal.find();
    if (!response) {
      return res.status(404).json({ massage: "get Major not found" });
    } else {
      res.json(response);
    }
  } catch (error) {
    res.status(500).json({ massage: "get Major data fail" });
  }
};

const viewMajor = async (req, res) => {
    const { id } = req.params;
    try {
      const response = await MajorModal.findById(id);
      if (response.length === 0) {
        return res.status(404).json({ massage: "get Major not found" });
      }
      res.status(200).json({ response});
    } catch (error) {
      console.error(error.message || error);
      res.status(500).json({
        error: error.message || error,
      });
    }
  };

const createMajor = async (req, res) => {
  try {
    //สร้างรหัสวิชา เลือกจากหน้าบ้าน => ได้เป็นหมายเลขออกมาประกอบกัน
    const newData = new MajorModal();
    const requestBody = req.body;

    newData.major_Id = requestBody.major_Id;
    newData.majorNameTH = requestBody.majorNameTH;
    newData.majorNameEN = requestBody.majorNameEN;
    newData.faculty = requestBody.faculty;
    newData.degree = requestBody.degree;
    newData.instructorMamber = requestBody.instructorMamber;
    newData.socialContact = requestBody.socialContact;
    newData.telephone = requestBody.telephone;
    newData.campus_id = requestBody.campus_id;
    newData.address = requestBody.address;
    newData.activeStatus = requestBody.activeStatus;
    newData.program = requestBody.program;
    newData.createDate = new Date();
    newData.updateDate = new Date();

    await newData.save();
    res.status(200).json({ newData });
  } catch (error) {
    console.error(error.message || error);

    res.status(500).json({
      message: "create new Major fail",
      error: error.message || error,
    });
  }
};

module.exports = {
  createMajor,
  getMasMajor,
  viewMajor
};
