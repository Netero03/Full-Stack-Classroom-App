// controllers/principalController.js

const Classroom = require('../models/Classroom');
const User = require('../models/User');

exports.assignStudentsToClassroom = async (req, res) => {
  const { studentIds } = req.body;
  const { classroomId } = req.params;

  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Update the students field with the assigned students
    classroom.students = [...new Set([...classroom.students, ...studentIds])];
    await classroom.save();

    // Update each student’s classroom field
    await User.updateMany(
      { _id: { $in: studentIds } },
      { classroom: classroomId }
    );

    res.status(200).json({ message: 'Students assigned successfully', classroom });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning students', error });
  }
};

exports.getClassroomWithStudents = async (req, res) => {
  const { classroomId } = req.params;

  try {
    const classroom = await Classroom.findById(classroomId).populate('students').populate('teacher');
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.status(200).json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classroom', error });
  }
};
