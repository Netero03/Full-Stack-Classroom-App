// controllers/userController.js

const User = require('../models/User');

// Get all Teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' }).populate('classroom');
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' }).populate('classroom');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create User (Principal only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User (Principal only)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, classroomId } = req.body;

    if (req.user.role !== 'Principal') {
      return res.status(403).json({ message: 'Only Principal can update users' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, classroom: classroomId },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User (Principal only)
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'Principal') {
      return res.status(403).json({ message: 'Only Principal can delete users' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentsByClassroom = async (req, res) => {
  try {
    const classroomId = req.user.classroom;  // Assuming req.user contains the authenticated user's info
    const students = await User.find({ classroom: classroomId, role: 'Student' });

    res.status(200).json({ status: 'success', data: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};