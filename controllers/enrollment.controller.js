const EnrollActionStatus = require("../enum/enrollEnum");
const EnrollmentModal = require("../model/enrollment.model");
const SectionModal = require("../model/section.modal");
const StudentModal = require("../model/student.modal");

const getEnrolllist = async (req, res) => {
  try {
    const getdata = await EnrollmentModal.find();
    if (getdata.length === 0) {
      return res.status(404).json({ message: "Data not  found" });
    } else {
      return res.status(200).json({ getdata });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const createEnrollment = async (req, res) => {
  try {
    const enrollData = new EnrollmentModal();
    const reqBody = req.body;

    enrollData.student_id = reqBody.student_id;
    enrollData.enrollsectionList = [];
    enrollData.semester = reqBody.semester;

    await enrollData.save();
    res.status(200).json({ enrollData });
  } catch (error) {
    res.status(500).json({
      message: "create new Enrollment data fail",
      error: error.message || error,
    });
  }
};

// ตรวจสอบเงื่อนไขเยอะ
const addNewEnroll = async (req, res) => {
  const { id } = req.params;

  const today = new Date();
  try {
    const getDataFromId = await EnrollmentModal.findById(id).populate(
      "student_id"
    );
    if (!getDataFromId) {
      return res.status(404).json({ message: "Data not  found" });
    }
    if (!req.body.section_id) {
      return res.status(400).json({ message: "Missing section_id to enroll" });
    }
    const getSection = await SectionModal.findById(req.body.section_id); //เข้าถึงข้อมูล section ใน id นี้
    if (!getSection) {
      return res.status(404).json({ message: "Your req Id not match" });
    }

    const getStudent = await StudentModal.findById(
      getDataFromId.student_id._id
    ); //เข้าถึงข้อมูล section ใน id นี้
    if (!getStudent) {
      return res.status(404).json({
        message: "Your student ID in enroll not match in student data",
      });
    }

    //ตรวจสอบว่า section ที่ลงตรงกับ เทอมในกรลงทะเบียนหรือไม่
    if (getSection.semester !== getDataFromId.semester) {
      return res
        .status(500)
        .json({ message: "this section not open in this semester" });
    }
    // ตรวจสอบว่่ามีที่นั่งเหลือไหม
    if (getSection.member.length >= getSection.limitCount) {
      return res
        .status(500)
        .json({ message: "Seat is full ,please choose next section" });
    } else {
      //วนตรวจทุกสมาชิก ว่าเจอ student_id ที่มีไหม
      const isStudentAlreadyEnrolled = getSection.member.some(
        (stuID) => stuID.toString() === getDataFromId.student_id._id.toString()
      );
      if (isStudentAlreadyEnrolled) {
        return res.status(500).json({ message: `Sorry your ID was enrolled` });
      }
      //ตรวจสอบสถานะการศึกษา
      if (getDataFromId.student_id.status === "นิสิตจบการศึกษาแล้ว") {
        return res
          .status(500)
          .json({ message: `Sorry your education status was graduate` });
      }
      //ตรวจสอบชั้นปีและสาขาใน section กับ ข้อมูลนักเรียน
      //.some ใช้ในการตรวจสอบค่าใน array
      const isMatchedMajorAndLevel = getSection.major.some(
        (section) =>
          section.level === getDataFromId.student_id.level &&
          section.major_id === getDataFromId.student_id.major_id
      );
      if (!isMatchedMajorAndLevel) {
        return res.status(500).json({
          message: `Sorry this section requires one of the allowed levels and majors.`,
        });
      }
    }
    //ถ้าทำการถอยรายวิชานั้นแล้ว สามารถลงทะเบียน section ซ้ำได้ (section ทำการลบ สมาชิกออก)
    const isWithDrawn = getDataFromId.enrollsectionList.some(
      (entry) =>
        entry.section_id.toString() === req.body.section_id &&
        entry.enrollmentStatus === EnrollActionStatus.WITHDRAW
    );
    if (!isWithDrawn) {
      return res
        .status(400)
        .json({ message: "You have already enrolled this section" });
    }

    //ทำการเพิ่มเข้าไปในช่อง enroll , section memberID , นำรหัส enroll ใน ข้อมูลนิสิตด้วย
    const addNewEnrollData = await EnrollmentModal.findByIdAndUpdate(
      id,
      {
        $push: {
          enrollsectionList: {
            section_id: req.body.section_id,
            enrollmentStatus: EnrollActionStatus.ADD,
            enrollmentTime: today,
          },
        },
      },
      { new: true } //return response data when yo can check if last data acturlly add to list
    );
    //add enrollId in student who enroll this section but add in one enrollID
    const addEnrollToStudentModel = await StudentModal.findByIdAndUpdate(
      getDataFromId.student_id._id,
      {
        $addToSet: {
          enrollList: getDataFromId._id,
        },
      }
    );
    //เพิ่มรายชื่อใหม่ลงใน section
    const addStudentIDInSectionList = await SectionModal.findByIdAndUpdate(
      req.body.section_id,
      {
        $push: {
          member: getDataFromId.student_id._id,
        },
      }
    );

    //ถ้าเงื่อนไขไหนผิดผลาด ให้ทำการ pull ค่าของทุกอันออก
    if (
      !addNewEnrollData ||
      !addEnrollToStudentModel ||
      !addStudentIDInSectionList
    ) {
      if (
        getDataFromId.enrollsectionList.length === 0 ||
        !getDataFromId.enrollsectionList.some(
          (item) => item.section_id.toString() === req.body.section_id
        )
      ) {
        return;
      } else {
        //ทำการลบข้อมูลก้อนที่พึ่งเพิ่มไป
        await EnrollmentModal.findByIdAndUpdate(id, {
          $pull: {
            enrollsectionList: { section_id: req.body.section_id },
          },
        });
      }
      if (
        getStudent.enrollList.length === 0 ||
        !getStudent.enrollList.some(
          (item) => item.toString() === getDataFromId._id.toString()
        )
      ) {
        return;
      } else {
        await StudentModal.findByIdAndUpdate(getDataFromId.student_id._id, {
          $pull: {
            enrollList: getDataFromId._id,
          },
        });
      }
      //ตรวจ member list in section
      if (
        getSection.member.length === 0 ||
        !getSection.member.some(
          (item) => item.toString() === getDataFromId.student_id._id
        )
      ) {
        return;
      } else {
        await SectionModal.findByIdAndUpdate(req.body.section_id, {
          $pull: {
            member: getDataFromId.student_id._id,
          },
        });
      }
      return res.status(500).json({
        message: `Sorry this data Failed to update enrollment data, Please Try again to enroll.`,
      });
    }

    res
      .status(200)
      .json({ message: "Your are already to enroll this section" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

//ถอนวิชาออก

const withdrawOrDropSection = async (req, res) => {

  const { id } = req.params;

  const today = new Date();
  try {
    //ใส id ด้วย enrollId
    const getDataFromId = await EnrollmentModal.findById(id).populate(
      "student_id"
    );
    if (!getDataFromId) {
      return res.status(404).json({ message: "Data not  found" });
    }
    if (!req.body.status || !req.body.section_id) {
      return res.status(400).json({ message: "Missing section_id or status" });
    }
    let changeStatusToWithdraw;
    if (req.body.status === EnrollActionStatus.WITHDRAW) {
      changeStatusToWithdraw = await EnrollmentModal.updateOne(
        {
          _id: id,
          "enrollsectionList.section_id": req.body.section_id,
        },
        {
          $set: {
            "enrollsectionList.$.enrollmentStatus": EnrollActionStatus.WITHDRAW,
            "enrollsectionList.$.enrollmentTime": today,
          },
        }
      );
    } else if (req.body.status === EnrollActionStatus.DROP) {
      changeStatusToWithdraw = await EnrollmentModal.updateOne(
        {
          _id: id,
          "enrollsectionList.section_id": req.body.section_id,
        },
        {
          $set: {
            "enrollsectionList.$.enrollmentStatus": EnrollActionStatus.DROP,
            "enrollsectionList.$.enrollmentTime": today,
          },
        }
      );
    }
    if (changeStatusToWithdraw.modifiedCount === 0) {
      return res
        .status(500)
        .json({ message: "Sorry to update enroll status to withdraw" });
    }

    const getSection = await SectionModal.findById(req.body.section_id); //เข้าถึงข้อมูล section ใน id นี้
    if (!getSection) {
      return res.status(404).json({ message: "Your req Id not match" });
    }
    //ทำการนำ getDataFromId.student_id._id ออก
    const studentIdStr = getDataFromId.student_id._id.toString();
    if (getSection.member.includes(studentIdStr)) {
      await SectionModal.findByIdAndUpdate(req.body.section_id, {
        $pull: {
          member: getDataFromId.student_id._id,
        },
      });
    }
    res.status(200).json({
      message: `Your are ${req.body.status.toLowerCase()} this section success!`
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  createEnrollment,
  getEnrolllist,
  addNewEnroll,
  withdrawOrDropSection,
};
