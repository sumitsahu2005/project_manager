const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  deleteProject,
  addMember,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, admin, createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .delete(protect, admin, deleteProject);

router.route('/:id/members')
  .put(protect, admin, addMember);

const { getTasks, createTask } = require('../controllers/taskController');

router.route('/:projectId/tasks')
  .get(protect, getTasks)
  .post(protect, admin, createTask);

module.exports = router;
