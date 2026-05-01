const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });

    const projectIds = projects.map((p) => p._id);

    // For members, only show tasks assigned to them
    let tasksQuery = { project: { $in: projectIds } };
    if (req.user.role === 'Member') {
      tasksQuery.assignedTo = req.user._id;
    }

    const tasks = await Task.find(tasksQuery);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
    
    // Overdue tasks
    const today = new Date();
    const overdueTasks = tasks.filter(
      (t) => t.status !== 'Completed' && new Date(t.dueDate) < today
    ).length;

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      totalProjects: projects.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
