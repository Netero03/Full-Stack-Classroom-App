const express = require('express');
const principalController = require('../controllers/principalController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Routes for creating Teachers and Students
router.put('/classrooms/:classroomId/assign-student', authMiddleware, roleMiddleware(['Principal']),principalController.assignStudentsToClassroom);
router.get('/classrooms/:classroomId', authMiddleware, roleMiddleware(['Principal']), principalController.getClassroomWithStudents);

module.exports = router;
