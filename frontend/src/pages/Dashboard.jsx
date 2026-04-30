import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { 
  CheckCircle2, 
  Clock, 
  FolderKanban, 
  ListTodo, 
  AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Projects', value: stats?.totalProjects || 0, icon: FolderKanban, color: 'bg-blue-500' },
    { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: ListTodo, color: 'bg-indigo-500' },
    { title: 'Completed', value: stats?.completedTasks || 0, icon: CheckCircle2, color: 'bg-green-500' },
    { title: 'In Progress', value: stats?.inProgressTasks || 0, icon: Clock, color: 'bg-yellow-500' },
    { title: 'Overdue', value: stats?.overdueTasks || 0, icon: AlertCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4 transition-transform hover:-translate-y-1 hover:shadow-md">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
