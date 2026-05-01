const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  deleteProject,
  addMember,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getProjects)
  .post(protect, authorize('Admin'), createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .delete(protect, authorize('Admin'), deleteProject);

router.route('/:id/members')
  .put(protect, authorize('Admin'), addMember);

const { getTasks, createTask } = require('../controllers/taskController');

router.route('/:projectId/tasks')
  .get(protect, getTasks)
  .post(protect, authorize('Admin'), createTask);

module.exports = router;
