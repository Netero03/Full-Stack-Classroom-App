// routes/classroomRoutes.js
const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// CRUD routes for Classrooms (Principal Only)
router.post('/', authMiddleware, roleMiddleware(['Principal']), classroomController.createClassroom);
router.get('/', authMiddleware, classroomController.getAllClassroom);
router.get('/:id', authMiddleware, classroomController.getClassroom);
router.put('/:id', authMiddleware, roleMiddleware(['Principal']), classroomController.updateClassroom);
router.delete('/:id', authMiddleware, roleMiddleware(['Principal']), classroomController.deleteClassroom);
router.put('/:id/assign-teacher', authMiddleware, roleMiddleware(['Principal']), classroomController.assignTeacher);
router.put('/:id/assign-student', authMiddleware, roleMiddleware(['Principal']), classroomController.assignStudent); 
router.put('/:id/remove-teacher', authMiddleware, roleMiddleware(['Principal']), classroomController.removeTeacher);
router.put('/:id/remove-student', authMiddleware, roleMiddleware(['Principal']), classroomController.removeStudent);

module.exports = router;
