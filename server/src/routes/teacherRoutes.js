const express = require('express');
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const Timetable = require('../models/Timetable');
const User = require('../models/User');

const router = express.Router();

router.get('/students', authMiddleware, roleMiddleware(['Teacher']), teacherController.getStudentsInClassroom);
router.get('/classroom', authMiddleware, roleMiddleware(['Teacher']), teacherController.getAssignedClassroom);  // New route to view assigned classroom

//Timetable

// Create a timetable
router.post('/timetable', authMiddleware, async (req, res) => {
    try {
        const teacher = await User.findById(req.user.id).populate('classroom');
        const { subject, day, startTime, endTime } = req.body;

        const newTimetable = new Timetable({
            classroom: teacher.classroom._id,
            subject,
            day,
            startTime,
            endTime
        });

        await newTimetable.save();
        res.status(201).json(newTimetable);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create timetable' });
    }
});

// Get timetables for the teacher's classroom
router.get('/timetables', authMiddleware, async (req, res) => {
    try {
        const teacher = await User.findById(req.user.id).populate('classroom');
        const timetables = await Timetable.find({ classroom: teacher.classroom._id });
        res.status(200).json(timetables);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch timetables' });
    }
});

// Update a timetable
router.put('/timetable/:id', authMiddleware, async (req, res) => {
    try {
        const { subject, day, startTime, endTime } = req.body;
        const updatedTimetable = await Timetable.findByIdAndUpdate(
            req.params.id,
            { subject, day, startTime, endTime },
            { new: true }
        );
        res.status(200).json(updatedTimetable);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update timetable' });
    }
});

// Delete a timetable
router.delete('/timetable/:id', authMiddleware, async (req, res) => {
    try {
        await Timetable.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Timetable deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete timetable' });
    }
});

module.exports = router;
