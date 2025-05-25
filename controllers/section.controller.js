const SectionModal = require("../model/section.modal");
const {mongoose} = require("mongoose");

const getSection = async (req, res) => {
  try {
    const response = await SectionModal.aggregate([
      {
        $lookup: {
          from: "subject",
          localField: "subject_id",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $unwind: "$subject",
      },
      {
        $lookup: {
          from: "instructor",
          localField: "Instructors_id",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $unwind: "$instructor",
      },
      {
        $project: {
          "subject.subjectID": 1,
          "subject.subjectNameTH": 1,
          "subject.subjectNameEN": 1,
          "subject.subjectType" : 1,
          timeSchedule: 1,
          roomNumber: 1,
          limitCount: 1,
          program: 1,
          memberCount: { $size: "$member" },
          member :1,
          semester:1,
          "instructor.instructorsNameTH": 1,
        },
      },
    ]);

    if (response.length === 0) {
      console.log("Data not found");
      return res.status(404).json({ massage: "get section not found" });
    } else {
      res.json(response);
      console.log("data fetch:", response);
    }
  } catch (error) {
    res.status(500).json({ massage: "get section not found" });
  }
};

const getMemberFromSection = async (req, res) => {
  try {
    const sectionId = req.body.sectionId;
    //ต้องการแสดงรายชื่อของนิสิตที่ทำการลงทะเบียน section นี้ โดยอ้างอิงรหัสนิสิตจากในตารางนิสิตกับ section โดยการวลลูปแสดง
    const response = await SectionModal.findById(sectionId).populate({path:'member',
    select : 'studentId studentFirstNameEN studentLastNameEN level major_id -_id'
  }).exec();
    if(!response){
      return res.status(404).json({ massage: "get section not found" });
    }
    res.status(200).json({ response });

  } catch (error) {
    res.status(500).json({ massage: "section not found",error });
  }
};

//ใช้ในการแสดงรายละเอียดของ section
const viewSection = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await SectionModal.findById(id)
      .populate("subject_id")
      .populate("Instructors_id");
    if (response.length === 0) {
      return res.status(404).json({ massage: "get section not found" });
    }
    res.status(200).json({ response });
  } catch (error) {
    console.error("❌ ERROR at //viewSection/ :", error.message || error);
    res.status(500).json({
      error: error.message || error,
    });
  }
};
//ใช้ในหน้าค้นหาวิชา เพื่อทำการลงทะเบียนเรียน
const viewSectionByFilter = async (req, res) => {
  try {
    const response = await SectionModal.aggregate([
      {
        $lookup: {
          from: "subject",
          localField: "subject_id",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $unwind: "$subject",
      },
      {
        $lookup: {
          from: "instructor",
          localField: "Instructors_id",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $unwind: "$instructor",
      },
      {
        $match: {
          ...(req.body.subjectName && {
            "subject.subjectNameEN": {
              $regex: req.body.subjectName,
              $options: "i",
            },
          }),
          ...(req.body.subjectID && {
            "subject.subjectID": {
              $regex: req.body.subjectID,
              $options: "i",
            },
          }),
          ...(req.body.program && { program: req.body.program }),
          ...(req.body.semester && { semester: req.body.semester }),
          ...(req.body.sectionId && { _id: req.body.sectionId }),
          ...(req.body.campus_id && { campus_id: req.body.campus_id }),
          actionStatus: "O",
        },
      },
      {
        $project: {
          "subject.subjectID": 1,
          "subject.subjectNameTH": 1,
          "subject.subjectNameEN": 1,
          timeSchedule: 1,
          roomNumber: 1,
          limitCount: 1,
          program: 1,
          memberCount: { $size: "$member" },
        },
      },
    ]);
    if (response.length === 0) {
      return res
        .status(404)
        .json({ massage: "this section not open to register" });
    }
    res.status(200).json({ response });
  } catch (error) {
    console.error("❌ ERROR at //viewSection/ :", error.message || error);
    res.status(500).json({
      error: error.message || error,
    });
  }
};

const createSection = async (req, res) => {
  try {
    //สร้างรหัสวิชา เลือกจากหน้าบ้าน => ได้เป็นหมายเลขออกมาประกอบกัน
    const newData = new SectionModal();
    const requestBody = req.body;
    newData.subject_id = requestBody.subject_id;
    newData.Instructors_id = requestBody.Instructors_id;
    newData.roomNumber = requestBody.roomNumber;
    newData.limitCount = requestBody.limitCount;
    newData.semester = requestBody.semester;
    newData.program = requestBody.program;
    newData.actionStatus = requestBody.actionStatus;
    newData.createDate = new Date();
    newData.updateDate = new Date();
    newData.member = requestBody.member;
    newData.timeSchedule = requestBody.timeSchedule;
    newData.major = requestBody.major;
    newData.campus_id = requestBody.campus_id;

    await newData.save();
    res.status(200).json({ newData });
  } catch (error) {
    console.error("❌ ERROR at /createSection:", error.message || error);

    res.status(500).json({
      message: "create new Section fail",
      error: error.message || error,
    });
  }
};

const updateSection = async (req, res) => {
  const { id } = req.params;
  try {
    const requestBody = req.body;
    const updateData = await SectionModal.findByIdAndUpdate(
      id,
      {
        subject_id: requestBody.subject_id,
        Instructors_id: requestBody.Instructors_id,
        roomNumber: requestBody.roomNumber,
        limitCount: requestBody.limitCount,
        semester: requestBody.semester,
        program: requestBody.program,
        actionStatus: requestBody.actionStatus,
        timeSchedule: requestBody.timeSchedule,
        member: requestBody.member,
        campus_id: requestBody.campus_id,
        updateDate: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateData) {
      return res.status(404).json({ massage: `update Section fail ${id}` });
    }
    //ดึงข้อมูลที่อัปเดตใหม่
    const getUpdateData = await SectionModal.findById(id);
    res.status(200).json(getUpdateData);
  } catch (error) {
    console.error("❌ ERROR at /updateSection :", error.message || error);
    res.status(500).json({
      massage: error.message || error,
    });
  }
};

const addSectionMajor = async (req, res) => {
  const { id } = req.params;

  try {
    const getSection = await SectionModal.findById(id);
    if (!getSection) {
      return res
        .status(404)
        .json({ massage: `this Section is not found to add` });
    }
    const foundData = getSection.major.some(
      (major) =>
        major.major_id.toString() === req.body.major_id &&
        major.level.toString() === req.body.level
    );
    if (foundData) {
      return res.status(500).json({
        message: `Major data to add found in this Section`,
      });
    }
    await SectionModal.findByIdAndUpdate(id, {
      $push: {
        major: { major_id: req.body.major_id, level: req.body.level },
      },
    });
    res.status(200).json({
      massage: `add Section major successfully`,
    });
  } catch (error) {
    console.error("❌ ERROR at /addSectionMajor :", error.message || error);
    res.status(500).json({
      massage: error.message || error,
    });
  }
};

const deleteSection = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await SectionModal.findByIdAndDelete(id);
    if (!subject) {
      return res
        .status(404)
        .json({ massage: `this ${id} not found to delete` });
    }
    res.status(200).json({ massage: `delete Section id : ${id} successfully` });
  } catch (error) {
    console.error("❌ ERROR at /deleteSection :", error.message || error);
    res.status(500).json({
      massage: error.message || error,
    });
  }
};

const removeSectionMajor = async (req, res) => {
  const { id } = req.params;
  const majorIdToRemove = req.body._id;
  try {
    const getSectionMajor = await SectionModal.findById(id);
    if (!getSectionMajor) {
      return res.status(404).json({ massage: `this section is not found` });
    }
    console.log("get section data  :", getSectionMajor);

    const foundMajorId = getSectionMajor.major.some(
      (major) => major._id.toString() === majorIdToRemove
    );
    console.log("found major id to remove :", foundMajorId);
    if (!foundMajorId) {
      return res.status(404).json({
        message: `Major id: ${majorIdToRemove} not found in this Section`,
      });
    }
    await SectionModal.findByIdAndUpdate(id, {
      $pull: {
        major: { _id: majorIdToRemove },
      },
    });
    res.status(200).json({
      massage: `delete Section major id : ${majorIdToRemove} successfully`,
    });
  } catch (error) {
    console.error("❌ ERROR at /deleteSection :", error.message || error);
    res.status(500).json({
      massage: error.message || error,
    });
  }
};

module.exports = {
  getSection,
  viewSection,
  createSection,
  updateSection,
  deleteSection,
  viewSectionByFilter,
  removeSectionMajor,
  addSectionMajor,
  getMemberFromSection,
};
