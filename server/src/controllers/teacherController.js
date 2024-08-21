const Timetable = require('../models/Timetable');
const Classroom = require('../models/Classroom');

exports.getStudentsInClassroom = async (req, res) => {
  const classroomId = req.user.classroom;
  const classroom = await Classroom.findById(classroomId).populate('students');
  res.status(200).json({ status: 'success', data: classroom.students });
};

exports.getAssignedClassroom = async (req, res) => {
  const classroomId = req.user.classroom;
  const classroom = await Classroom.findById(classroomId).populate('teacher students');
  
  if (!classroom) {
    return res.status(404).json({ status: 'fail', message: 'Classroom not found' });
  }

  res.status(200).json({ status: 'success', data: classroom });
};
