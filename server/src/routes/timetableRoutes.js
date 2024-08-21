// routes/timetableRoutes.js
const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// CRUD routes for Timetables (Teachers Only)
router.post('/', authMiddleware, roleMiddleware(['Teacher']), timetableController.createTimetable);
router.get('/:classroomId', authMiddleware, roleMiddleware(['Principal','Teacher','Student']), timetableController.getTimetables);
router.put('/:id', authMiddleware, roleMiddleware(['Teacher']), timetableController.updateTimetable);
router.delete('/:id', authMiddleware, roleMiddleware(['Teacher']), timetableController.deleteTimetable);

module.exports = router;
