const StudentModal = require("../model/student.modal");
const { handleError } = require("../util/utilFunction");
const { createToken, maxAgeToken } = require("./user.controller");

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
          ...(req.body.studentFirstNameEN && {
            studentFirstNameEN: req.body.studentFirstNameEN,
          }),
          ...(req.body.studentLastNameEN && {
            studentLastNameEN: req.body.studentLastNameEN,
          }),
          ...(req.body.level && { level: req.body.level }),
          ...(req.body.majorNameTH && {
            "major.majorNameTH": {
              $regex: req.body.majorNameTH,
              $options: "i",
            },
          }),
        },
      },
      {
        $project: {
          studentId: 1,
          studentFirstNameEN: 1,
          studentLastNameEN: 1,
          level: 1,
          status :1,
          major_id : 1,
          "major.majorNameEN": 1,
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
    const response = await StudentModal.findById(id);
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
    newData.addmissionYear = requestBody.addmissionYear;
    newData.status = "ยังศึกษาอยู่";
    newData.password = requestBody.password;
    newData.role = "Student";
    await newData.save();
    const token = createToken(newData._id); //ทำการเก็บรหัสเป็น token
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAgeToken * 1000,
    });
    res.status(200).json({ newData, token: token });
  } catch (error) {
    console.error(error);
    const errMassage = handleError(error);
    res.status(500).json({ errMassage });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const requestBody = req.body;
    const updateData = await StudentModal.findByIdAndUpdate(
      id,
      {
        studentFirstNameEN: requestBody.studentFirstNameEN,
        studentLastNameEN: requestBody.studentLastNameEN,
        telephone: requestBody.telephone,
        campus_id: requestBody.campus_id,
        AdmissionType: requestBody.AdmissionType,
        major_id : requestBody.major_id
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


const changeToGrduate = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await StudentModal.findById(id);
    if (!student) {
      return res.status(404).json({ message: "ไม่มีข้อมูลนิสิตคนนี้ในระบบ" });
    }
    if(student.level !== 4){
    res.status(500).json({ massage: "ไม่สามารถขอยื่นจบการศึกษาได้" });
    }
    else{
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
        data : response
      });
    }
  } catch (error) {
    res.status(500).json({ massage: error.massage || error });
  }
};

module.exports = {
  createStudent,
  changeToGrduate,
  updateStudent,
  getStudent,
  viewStudent,}
