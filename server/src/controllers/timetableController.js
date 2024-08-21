// controllers/timetableController.js
const Timetable = require('../models/Timetable');
const Classroom = require('../models/Classroom');

// Create Timetable
exports.createTimetable = async (req, res) => {
  try {
    const { subject, startTime, endTime, day, classroomId } = req.body;

    if (req.user.role !== 'Teacher') {
      return res.status(403).json({ message: 'Only Teachers can create timetables' });
    }

    const classroom = await Classroom.findById(classroomId);
    if (!classroom || classroom.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only create timetables for your assigned classroom' });
    }

    const timetable = new Timetable({ subject, startTime, endTime, day, classroom: classroomId });
    await timetable.save();

    res.status(201).json({ message: 'Timetable created successfully', timetable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Timetables by Classroom
exports.getTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find({ classroom: req.params.classroomId });
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Timetable
exports.updateTimetable = async (req, res) => {
  try {
    const { subject, startTime, endTime, day } = req.body;

    if (req.user.role !== 'Teacher') {
      return res.status(403).json({ message: 'Only Teachers can update timetables' });
    }

    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      { subject, startTime, endTime, day },
      { new: true }
    );

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.status(200).json({ message: 'Timetable updated successfully', timetable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Timetable
exports.deleteTimetable = async (req, res) => {
  try {
    if (req.user.role !== 'Teacher') {
      return res.status(403).json({ message: 'Only Teachers can delete timetables' });
    }

    const timetable = await Timetable.findByIdAndDelete(req.params.id);

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.status(200).json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
