// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Get all Teachers
router.get('/teachers', authMiddleware, roleMiddleware(['Principal']), userController.getTeachers);

// Get all Students
router.get('/students', authMiddleware, roleMiddleware(['Principal', 'Teacher']), userController.getStudents);

// Update User
router.post('/', authMiddleware, roleMiddleware(['Principal']), userController.createUser);

// Update User
router.put('/:id', authMiddleware, roleMiddleware(['Principal']), userController.updateUser);

// Delete User
router.delete('/:id', authMiddleware, roleMiddleware(['Principal']), userController.deleteUser);

// Get students by classroom
router.get('/classStudents', authMiddleware, roleMiddleware(['Principal', 'Teacher', 'Student']), userController.getStudentsByClassroom);

module.exports = router;
