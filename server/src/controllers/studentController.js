// controllers/studentController.js
const Classroom = require('../models/Classroom');
const Timetable = require('../models/Timetable');
const User = require('../models/User');

// Get Classroom Details and Classmates
exports.getMyClassroom = async (req, res) => {
  try {
    const studentId = req.user.id; // Assuming req.user contains the logged-in user's data

    const student = await User.findById(studentId).populate('classroom');

    if (!student || !student.classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    const classroom = await Classroom.findById(student.classroom._id)
      .populate('teacher', 'name email')
      .populate('students', 'name email');

    res.json({
      classroom: {
        name: classroom.name,
        startTime: classroom.startTime,
        endTime: classroom.endTime,
        days: classroom.days,
        teacher: classroom.teacher,
      },
      classmates: classroom.students,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Timetable for the Assigned Classroom
exports.getClassroomTimetable = async (req, res) => {
  try {
    const studentId = req.user.id; // Assuming req.user contains the logged-in user's data

    const student = await User.findById(studentId).populate('classroom');

    if (!student || !student.classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    const timetable = await Timetable.find({ classroom: student.classroom._id });

    res.json(timetable);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
