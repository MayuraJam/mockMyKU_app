const SubjectModal = require("../model/subject.modal");

const getSubjects = async (req, res) => {
  try {
    const subjectRes = await SubjectModal.find(); //แสดงข้อมูล
    if (subjectRes.length === 0) {
      console.log("Data not found");
      return res.status(404).json({ massage: "get Subject not found" });
    } else {
      res.json(subjectRes);
      console.log("data fetch:", subjectRes);
    }
  } catch (error) {
    res.status(500).json({ massage: "get Subject data fail" });
  }
};

const viewSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await SubjectModal.findById(id);
    if (subject.length === 0) {
      return res.status(404).json({ massage: "get Subject not found" });
    }
    res.status(200).json({ subject });
  } catch (error) {
    console.error("❌ ERROR at //getSubjectByID/ :", error.message || error);
    res.status(500).json({
      message: "get Subject fail",
      error: error.message || error,
    });
  }
};

const createSubject = async (req, res) => {
  try {
    const newSubject = await SubjectModal.create(req.body); //create new sunject service
    const lineSentMassage = `📚 วิชาใหม่ถูกเพิ่มแล้ว:\nรหัส: ${newSubject.subjectID}\nชื่อ: ${newSubject.subjectNameTH}`;
    //  await sendLineNotificate(lineSentMassage);
    console.log("message to sent line notificate:", lineSentMassage);
    res.status(200).json({ newSubject });
  } catch (error) {
    console.error("❌ ERROR at /createSubject:", error.message || error);

    res.status(500).json({
      message: "create new subject fail",
      error: error.message || error,
    });
  }
};

const updateSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await SubjectModal.findByIdAndUpdate(id, req.body);
    if (!subject) {
      return res.status(404).json({ massage: `update subject fail ${id}` });
    }
    //ดึงข้อมูลที่อัปเดตใหม่
    const updateSubject = await SubjectModal.findById(id);
    res.status(200).json(updateSubject);
  } catch (error) {
    console.error("❌ ERROR at /updateSubject :", error.message || error);
    res.status(500).json({
      massage: error.message || error,
    });
  }
};

const deleteSubject = async (req, res) => {
    const {id} = req.params;
    try {
      const subject = await SubjectModal.findByIdAndDelete(id);
      if(!subject){
        return res.status(404).json({ massage: `this ${id} not found to delete` });
      }
      res.status(200).json({massage:`delete subject id : ${id} successfully`})
    } catch (error) {
      console.error("❌ ERROR at /deleteSubject :", error.message || error);
      res.status(500).json({
        massage: error.message || error
      });
    }
  };

module.exports = {
  getSubjects,
  viewSubject,
  createSubject,
  updateSubject,
  deleteSubject
};
