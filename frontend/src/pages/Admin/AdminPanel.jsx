import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, Building, Settings, BarChart3, TrendingUp,
  FileText, Eye, AlertTriangle, CheckCircle, Zap, Globe,
  ArrowRight, Target, Award, Activity, Database, Server, Gift
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchPanelData();
  }, []);

  const fetchPanelData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/panel').catch(() => ({ data: { data: null } }));
      setStats(res.data.data || {});
    } catch (error) {
      console.error('Error fetching panel data:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load panel data');
      }
    } finally {
      setLoading(false);
    }
  };

  const QuickAccessCard = ({ title, description, icon: IconComponent, color, onClick, count }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 cursor-pointer transition-all hover:shadow-xl hover:border-indigo-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${color}`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        {count !== undefined && (
          <span className="text-2xl font-black text-gray-900">{count}</span>
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center text-indigo-600 font-semibold">
        <span className="text-sm">Access Now</span>
        <ArrowRight className="w-4 h-4 ml-2" />
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black mb-2">Admin Control Panel 🛡️</h1>
            <p className="text-lg text-white/90">
              Comprehensive platform management and administration
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <QuickAccessCard
            title="Dashboard Overview"
            description="View platform-wide statistics and key metrics"
            icon={BarChart3}
            color="from-blue-500 to-cyan-600"
            onClick={() => navigate('/admin/dashboard')}
            count={stats?.dashboardStats || 0}
          />
          <QuickAccessCard
            title="User Management"
            description="Manage all users across the platform"
            icon={Users}
            color="from-green-500 to-emerald-600"
            onClick={() => navigate('/admin/users')}
            count={stats?.totalUsers || 0}
          />
          <QuickAccessCard
            title="Analytics"
            description="Deep insights and analytics reports"
            icon={TrendingUp}
            color="from-purple-500 to-pink-600"
            onClick={() => navigate('/admin/analytics')}
          />
          <QuickAccessCard
            title="School Management"
            description="Manage all schools and institutions"
            icon={Building}
            color="from-orange-500 to-red-600"
            onClick={() => navigate('/admin/dashboard')}
            count={stats?.totalSchools || 0}
          />
          <QuickAccessCard
            title="Settings"
            description="Platform configuration and settings"
            icon={Settings}
            color="from-indigo-500 to-purple-600"
            onClick={() => navigate('/admin/settings')}
          />
          <QuickAccessCard
            title="Statistics Panel"
            description="Detailed statistics and reporting"
            icon={Database}
            color="from-teal-500 to-cyan-600"
            onClick={() => navigate('/admin/stats')}
          />
          <QuickAccessCard
            title="Goodie Orders"
            description="Track HealCoin-goodie requests and delivery status"
            icon={Gift}
            color="from-amber-500 to-orange-500"
            onClick={() => navigate('/admin/goodie-orders')}
          />
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Server className="w-7 h-7 text-green-600" />
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Platform Status</span>
              </div>
              <p className="text-2xl font-black text-green-600">Operational</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Uptime</span>
              </div>
              <p className="text-2xl font-black text-blue-600">99.9%</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Security</span>
              </div>
              <p className="text-2xl font-black text-purple-600">Secure</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
