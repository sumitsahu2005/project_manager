const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    let projects;
    
    if (req.user.role === 'Admin') {
      projects = await Project.find({
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      });
    } else {
      projects = await Project.find({
        members: req.user._id,
      });
    }

    const projectIds = projects.map((p) => p._id);

    // Get tasks for these projects
    // For members, optionally only show tasks assigned to them? 
    // Usually, members can see all tasks in a project they are part of.
    let tasksQuery = { project: { $in: projectIds } };
    
    if (req.user.role === 'Member') {
      // If we want members to only see their stats, uncomment below:
      // tasksQuery.assignedTo = req.user._id;
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
