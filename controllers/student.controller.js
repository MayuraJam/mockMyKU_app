const StudentModal = require("../model/student.modal");
const mongoose = require("mongoose");

const getStudent = async (req, res) => {
  try {
    const response = await StudentModal.aggregate([
      {
        $lookup: {
          from: "major",
          localField: "major_id",
          foreignField: "major_Id",
          as: "major",
        },
      },
      {
        $unwind: "$major",
      },
      {
        $match: {
          ...(req.body.studentId && { studentId: req.body.studentId }),
          ...(req.body.studentFirstNameTH && {
            studentFirstNameTH: req.body.studentFirstNameTH,
          }),
          ...(req.body.studentLastNameTH && {
            studentLastNameTH: req.body.studentLastNameTH,
          }),
          ...(req.body.studentFirstNameEN && {
            studentFirstNameEN: req.body.studentFirstNameEN,
          }),
          ...(req.body.studentLastNameEN && {
            studentLastNameEN: req.body.studentLastNameEN,
          }),
          ...(req.body.level && { level: req.body.level }),
          ...(req.body.majorNameTH&&{
            "major.majorNameTH" :{
              $regex:req.body.majorNameTH,
              $options : "i"
            }
          })
        },
      },
      {
        $project: {
          studentId: 1,
          studentFirstNameTH: 1,
          studentLastNameTH: 1,
          studentFirstNameEN: 1,
          studentLastNameEN: 1,
          level: 1,
          "major.majorNameEN" : 1,
        },
      },
    ]);
    if (response.length === 0) {
      console.log("Data not found");
      return res.status(404).json({ massage: "get student not found" });
    } else {
      res.json(response);
      console.log("data fetch:", response);
    }
  } catch (error) {
    res.status(500).json({ massage: error });
  }
};

const viewStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await StudentModal.findById(id)      
    if (!response) {
      return res.status(404).json({ massage: "student data not found" });
    }
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({
      error: error.message || error,
    });
  }
};

const getOnlyYear = () => {
  const currentYear = (new Date().getFullYear() + 543).toString().slice(-2);
  return currentYear;
};

const createEmail = (firstname, lastName) => {
  const emailFormat = `${firstname.toLowerCase()}.${lastName
    .slice(0, 2)
    .toLowerCase()}@ku.ac.th`;
  return emailFormat;
};

const createStudent = async (req, res) => {
  try {
    //สร้างรหัสวิชา เลือกจากหน้าบ้าน => ได้เป็นหมายเลขออกมาประกอบกัน
    const newData = new StudentModal();
    const requestBody = req.body;
    const randomId =
      getOnlyYear() +
      "3020" +
      Math.floor(1000 + Math.random() * 9000).toString();

    newData.studentId = randomId;
    newData.studentFirstNameTH = requestBody.studentFirstNameTH;
    newData.studentLastNameTH = requestBody.studentLastNameTH;
    newData.studentFirstNameEN = requestBody.studentFirstNameEN;
    newData.studentLastNameEN = requestBody.studentLastNameEN;
    newData.level = 1;
    newData.major_id = requestBody.major_id;
    newData.email = createEmail(
      requestBody.studentFirstNameEN,
      requestBody.studentLastNameEN
    );
    newData.telephone = requestBody.telephone;
    newData.campus_id = requestBody.campus_id;
    newData.AdmissionType = requestBody.AdmissionType;
    newData.sex = requestBody.sex;
    newData.birthDate = requestBody.birthDate;
    newData.addmissionYear = requestBody.addmissionYear;
    newData.createDate = new Date();
    newData.updateDate = new Date();
    newData.status = "ยังศึกษาอยู่";
    await newData.save();
    res.status(200).json({ newData });
  } catch (error) {
    console.error(error.message || error);

    res.status(500).json({
      message: "create new student fail",
      error: error.message || error,
    });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const requestBody = req.body;
    const updateData = await StudentModal.findByIdAndUpdate(
      id,
      {
        studentFirstNameTH: requestBody.studentFirstNameTH,
        studentLastNameTH: requestBody.studentLastNameTH,
        studentFirstNameEN: requestBody.studentFirstNameEN,
        studentLastNameEN: requestBody.studentLastNameEN,
        telephone: requestBody.telephone,
        updateDate: new Date(),
      },
      {
        new: true, // ให้คืนค่าที่อัปเดตแล้ว
        runValidators: true, // ให้ตรวจสอบ schema validation ด้วย
      }
    );

    if (!updateData) {
      return res.status(404).json({ massage: `update student fail ${id}` });
    }
    //ดึงข้อมูลที่อัปเดตใหม่
    const getUpdateData = await StudentModal.findById(id);
    res.status(200).json(getUpdateData);
  } catch (error) {
    console.error("❌ ERROR at /updateStudent :", error.message || error);
    res.status(500).json({
      massage: error.message || error,
    });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await StudentModal.findByIdAndUpdate(
      id,
      {
        status: "นิสิตจบการศึกษาแล้ว",
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!response) {
      return res.status(404).json({
        massage: "Id not found to delete",
      });
    }
    res.status(200).json({
      massage: `delete student id : ${id} successfully`,
    });
  } catch (error) {
    res.status(500).json({ massage: error.massage || error });
  }
};

module.exports = {
  createStudent,
  deleteStudent,
  updateStudent,
  getStudent,
  viewStudent
};
