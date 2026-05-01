const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Note: /api/projects/:projectId/tasks routing is handled in server.js or projectRoutes,
// but let's assume we map /api/tasks to this router and handle specific project tasks here
// Or we can map /api/tasks and use query params/nested routes.
// To keep it simple, I'll use standard routes.

// Routes for specific tasks
router.route('/:id')
  .put(protect, authorize('Admin'), updateTask)
  .delete(protect, authorize('Admin'), deleteTask);

router.route('/:id/status')
  .put(protect, updateTaskStatus);

module.exports = router;
