// routes/studentRoutes.js
const express = require('express');
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/classroom', authMiddleware, roleMiddleware(['Principal', 'Teacher', 'Student']), studentController.getMyClassroom);
router.get('/timetable', authMiddleware, roleMiddleware(['Principal', 'Teacher', 'Student']), studentController.getClassroomTimetable);

module.exports = router;
