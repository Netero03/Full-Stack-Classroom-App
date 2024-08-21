// controllers/classroomController.js
const Classroom = require('../models/Classroom');
const User = require('../models/User');

// Create Classroom
exports.createClassroom = async (req, res) => {
    try {
        const { name, startTime, endTime, days, teacherId, studentIds } = req.body;
        console.log('Received Data:', { name, startTime, endTime, days, teacherId, studentIds });

        if (req.user.role !== 'Principal') {
            return res.status(403).json({ message: 'Only Principal can create classrooms' });
        }

        const classroom = new Classroom({ name, startTime, endTime, days, teacher: teacherId, students: studentIds });
        await classroom.save();

        res.status(201).json({ message: 'Classroom created successfully', classroom });
    } catch (error) {
        console.error('Error creating classroom:', error.message);
        res.status(500).json({ message: error.message });
    }
};


// Get Classroom details
exports.getAllClassroom = async (req, res) => {
    try {
        const classrooms = await Classroom.find().populate('teacher');
        res.status(200).json(classrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get All Classroom
exports.getClassroom = async (req, res) => {
    try {
        // Populate both 'teacher' and 'students' fields with their respective details
        const classroom = await Classroom.findById(req.params.id)
            .populate('teacher')  // Populate teacher details
            .populate('students');  // Populate student details

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        res.status(200).json(classroom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Classroom (Assign Teachers & Students)
exports.updateClassroom = async (req, res) => {
    try {
        const { teacherId, studentIds } = req.body;

        if (req.user.role !== 'Principal') {
            return res.status(403).json({ message: 'Only Principal can update classrooms' });
        }

        const classroom = await Classroom.findByIdAndUpdate(
            req.params.id,
            { teacher: teacherId, students: studentIds },
            { new: true }
        );

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        res.status(200).json({ message: 'Classroom updated successfully', classroom });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Classroom
exports.deleteClassroom = async (req, res) => {
    try {
        if (req.user.role !== 'Principal') {
            return res.status(403).json({ message: 'Only Principal can delete classrooms' });
        }

        const classroom = await Classroom.findByIdAndDelete(req.params.id);

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        res.status(200).json({ message: 'Classroom deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignTeacher = async (req, res) => {
    try {
        const { teacherId } = req.body;

        if (req.user.role !== 'Principal') {
            return res.status(403).json({ message: 'Only Principal can assign teachers' });
        }

        const teacher = await User.findById(teacherId);

        if (!teacher || teacher.role !== 'Teacher') {
            return res.status(400).json({ message: 'Invalid Teacher ID' });
        }

        if (teacher.classroom) {
            return res.status(400).json({ message: 'Teacher already assigned to a classroom' });
        }

        const classroom = await Classroom.findByIdAndUpdate(
            req.params.id,
            { teacher: teacherId },
            { new: true }
        );

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        teacher.classroom = classroom._id;
        await teacher.save();

        res.status(200).json({ message: 'Teacher assigned to classroom successfully', classroom });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignStudent = async (req, res) => {
    try {
        const classroomId = req.params.id;
        const { studentIds } = req.body;

        // Find the classroom
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Ensure the students exist and belong to the correct role
        const students = await User.find({ _id: { $in: studentIds }, role: 'Student' });

        if (students.length !== studentIds.length) {
            return res.status(404).json({ message: 'One or more students not found or not in the student role' });
        }

        // Add the students to the classroom without replacing the existing ones
        const updatedClassroom = await Classroom.findByIdAndUpdate(
            classroomId,
            { $push: { students: { $each: studentIds } } },
            { new: true }
        );

        // Update each student's classroom reference
        await User.updateMany(
            { _id: { $in: studentIds }, role: 'Student' },
            { $set: { classroom: classroom._id } }
        );

        res.status(200).json({ message: 'Students assigned successfully', classroom: updatedClassroom });
    } catch (error) {
        console.error('Error assigning students:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// controllers/classroomController.js
exports.removeTeacher = async (req, res) => {
    try {
        const classroomId = req.params.id;

        // Find the classroom
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Get the teacher's ID before removing it from the classroom
        const teacherId = classroom.teacher;

        if (teacherId) {
            // Remove the classroom reference from the teacher's User document
            const teacher = await User.findById(teacherId);
            if (!teacher) {
                return res.status(404).json({ message: 'Teacher not found' });
            }
            await User.updateOne(
                { _id: teacherId },
                { $unset: { classroom: "" } }
            );
        }

        // Clear the teacher field in the classroom
        classroom.teacher = null;
        await classroom.save();

        res.status(200).json({ message: 'Teacher removed successfully', classroom });
    } catch (error) {
        console.error('Error removing teacher:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Remove Student from Classroom
exports.removeStudent = async (req, res) => {
    try {
        const classroomId = req.params.id;
        const { studentId } = req.body;

        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Remove the student from the classroom
        classroom.students = classroom.students.filter(id => id.toString() !== studentId);
        await classroom.save();

        // Update the student's classroom reference to null
        await User.findByIdAndUpdate(studentId, { classroom: null });

        res.status(200).json({ message: 'Student removed successfully', classroom });
    } catch (error) {
        console.error('Error removing student:', error);
        res.status(500).json({ message: 'Server error' });
    }
};