import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const TaskList = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(projectId || '');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data);
        if (data.length > 0 && !selectedProject) {
          setSelectedProject(data[0]._id);
        }
      } catch (error) {
        toast.error('Failed to load projects');
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedProject) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get(`/projects/${selectedProject}/tasks`);
        setTasks(data);
      } catch (error) {
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedProject]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${selectedProject}/tasks`, {
        title,
        description,
        dueDate,
        assignedTo: assignedTo || null,
      });
      toast.success('Task created successfully!');
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssignedTo('');
      // Refresh tasks
      const { data } = await api.get(`/projects/${selectedProject}/tasks`);
      setTasks(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      toast.success('Task status updated');
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'In Progress': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const TaskCard = ({ task }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-slate-900">{task.title}</h4>
      </div>
      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
      {task.assignedTo && (
        <div className="text-xs text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-md font-medium mb-3 border border-blue-100">
          👤 {task.assignedTo.name || 'Unknown'}
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
        <select
          value={task.status}
          onChange={(e) => updateTaskStatus(task._id, e.target.value)}
          className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:ring-0 cursor-pointer ${
            task.status === 'Completed' ? 'bg-green-100 text-green-800' :
            task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
            'bg-slate-100 text-slate-800'
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );

  const currentProjectObj = projects.find(p => p._id === selectedProject);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Task Board</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="" disabled>Select Project</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.title}</option>
            ))}
          </select>
          
          {selectedProject && user?.role === 'Admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Task
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : !selectedProject ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">Please select a project to view tasks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Column */}
          <div className="bg-slate-100 rounded-xl p-4">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-slate-400 mr-2"></span>
              To Do ({tasks.filter(t => t.status === 'Pending').length})
            </h3>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'Pending').map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-slate-100 rounded-xl p-4">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
              In Progress ({tasks.filter(t => t.status === 'In Progress').length})
            </h3>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'In Progress').map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-slate-100 rounded-xl p-4">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              Completed ({tasks.filter(t => t.status === 'Completed').length})
            </h3>
            <div className="space-y-3">
              {tasks.filter(t => t.status === 'Completed').map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Create New Task</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {currentProjectObj?.members?.map(member => (
                    <option key={member._id} value={member._id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
