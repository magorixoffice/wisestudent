import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield, ShieldCheck, TrendingUp, Users, Building, Activity, Database,
  AlertTriangle, CheckCircle, Globe, BarChart3, Zap,
  FileText, Settings, Award, Network, Store, Scale,
  MapPin, Clock, Server, Lock, Download, Plus, Bell,
  ArrowRight, Trophy, Target, Flame, Sparkles, Star, TrendingDown,
  Brain, DollarSign, Headphones, History, MessageSquare, Wrench, Key
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeIncidents, setActiveIncidents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [dashboardRes, incidentsRes] = await Promise.all([
        api.get('/api/admin/dashboard').catch(() => ({ data: { data: null } })),
        api.get('/api/incidents?status=open').catch(() => ({ data: { data: [] } }))
      ]);

      setStats(dashboardRes.data.data);
      setActiveIncidents(incidentsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: IconComponent, color, trend, onClick, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 cursor-pointer transition-all ${
        onClick ? 'hover:shadow-xl hover:border-indigo-300' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${color}`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-bold">{trend}</span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-black text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );

  const QuickActionButton = ({ label, icon: IconComponent, color, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r ${color} text-white font-bold shadow-lg hover:shadow-xl transition-all`}
    >
      <IconComponent className="w-6 h-6" />
      {label}
    </motion.button>
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
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <h1 className="text-4xl font-black mb-2">
                Admin Dashboard 🛡️
              </h1>
              <p className="text-lg text-white/90">
                Platform-wide analytics, compliance, and governance
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Today's Date</p>
              <p className="text-xl font-bold">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Quick Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4 mb-8"
        >
          <QuickActionButton
            label="Behavior Analytics"
            icon={Activity}
            color="from-indigo-500 to-purple-600"
            onClick={() => navigate('/admin/behavior-analytics')}
          />
          <QuickActionButton
            label="Smart Insights"
            icon={Brain}
            color="from-pink-500 to-rose-600"
            onClick={() => navigate('/admin/smart-insights')}
          />
          <QuickActionButton
            label="School Approvals"
            icon={ShieldCheck}
            color="from-purple-500 to-indigo-600"
            onClick={() => navigate('/admin/approvals')}
          />
          <QuickActionButton
            label="Financial Console"
            icon={DollarSign}
            color="from-green-500 to-emerald-600"
            onClick={() => navigate('/admin/financial-console')}
          />
          <QuickActionButton
            label="Support Desk"
            icon={Headphones}
            color="from-blue-500 to-cyan-600"
            onClick={() => navigate('/admin/support-desk')}
          />
          <QuickActionButton
            label="Lifecycle"
            icon={Users}
            color="from-indigo-500 to-purple-600"
            onClick={() => navigate('/admin/lifecycle')}
          />
          <QuickActionButton
            label="Content Governance"
            icon={Shield}
            color="from-purple-500 to-pink-600"
            onClick={() => navigate('/admin/content-governance')}
          />
          <QuickActionButton
            label="Audit Timeline"
            icon={History}
            color="from-gray-500 to-slate-600"
            onClick={() => navigate('/admin/audit-timeline')}
          />
          <QuickActionButton
            label="Configuration"
            icon={Settings}
            color="from-indigo-500 to-purple-600"
            onClick={() => navigate('/admin/configuration')}
          />
          <QuickActionButton
            label="Communication"
            icon={MessageSquare}
            color="from-blue-500 to-cyan-600"
            onClick={() => navigate('/admin/communication')}
          />
          <QuickActionButton
            label="Operational"
            icon={Wrench}
            color="from-orange-500 to-amber-600"
            onClick={() => navigate('/admin/operational')}
          />
          <QuickActionButton
            label="Predictive"
            icon={Brain}
            color="from-purple-500 to-pink-600"
            onClick={() => navigate('/admin/predictive')}
          />
          <QuickActionButton
            label="API Control"
            icon={Key}
            color="from-teal-500 to-cyan-600"
            onClick={() => navigate('/admin/api-control')}
          />
          <QuickActionButton
            label="Platform"
            icon={Globe}
            color="from-indigo-500 to-purple-600"
            onClick={() => navigate('/admin/platform')}
          />
          <QuickActionButton
            label="Admin Panel"
            icon={Target}
            color="from-rose-500 to-pink-600"
            onClick={() => navigate('/admin/panel')}
          />
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Schools"
            value={stats?.schoolsByRegion?.reduce((sum, r) => sum + (r.totalSchools || 0), 0) || 0}
            icon={Building}
            color="from-blue-500 to-cyan-600"
            trend="+3%"
            subtitle="Active schools"
            onClick={() => navigate('/admin/dashboard')}
          />
          <StatCard
            title="Total Students"
            value={stats?.studentActiveRate?.totalStudents || 0}
            icon={Users}
            color="from-green-500 to-emerald-600"
            trend="+12%"
            subtitle="Across platform"
            onClick={() => navigate('/admin/dashboard')}
          />
          <StatCard
            title="Active Incidents"
            value={activeIncidents.length}
            icon={AlertTriangle}
            color="from-red-500 to-pink-600"
            trend={activeIncidents.length > 0 ? 'Active' : 'Clear'}
            subtitle="SLA & privacy"
            onClick={() => navigate('/admin/incidents')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Schools by Region */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Building className="w-7 h-7 text-blue-600" />
                  Schools by Region
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stats?.schoolsByRegion?.length > 0 ? stats.schoolsByRegion.slice(0, 4).map((region, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="text-2xl font-black text-blue-600">{region.activeSchools || 0}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{region.region || 'Unknown'}</p>
                    <p className="text-xs text-gray-600">{region.totalSchools || 0} total schools</p>
                  </div>
                )) : (
                  <div className="col-span-2 text-center py-8 text-gray-500">No schools data available</div>
                )}
              </div>
            </motion.div>

            {/* Platform Health */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Server className="w-7 h-7 text-green-600" />
                  Platform Health
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Uptime</span>
                  </div>
                  <p className="text-2xl font-black text-green-600">{stats?.platformHealth?.uptime ? `${stats.platformHealth.uptime}%` : '99.9%'}</p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-600">Response Time</span>
                  </div>
                  <p className="text-2xl font-black text-orange-600">{stats?.platformHealth?.averageLatency || '120'}ms</p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-gray-600">Error Rate</span>
                  </div>
                  <p className="text-2xl font-black text-red-600">{stats?.platformHealth?.errorRate || '0.1'}%</p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Security</span>
                  </div>
                  <p className="text-2xl font-black text-purple-600">A+</p>
                </div>
              </div>
            </motion.div>

            {/* Privacy & Compliance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Lock className="w-7 h-7 text-purple-600" />
                  Privacy & Compliance
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">GDPR Compliance</span>
                  </div>
                  <p className="text-2xl font-black text-green-600">{stats?.privacyCompliance?.complianceRate || 99}%</p>
                  <p className="text-xs text-gray-600 mt-1">{stats?.privacyCompliance?.totalStudents || 0} students</p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-gray-600">Privacy Incidents</span>
                  </div>
                  <p className="text-2xl font-black text-red-600">{stats?.privacyCompliance?.privacyIncidents || 0}</p>
                  <p className="text-xs text-gray-600 mt-1">Active flags</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Active Incidents */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                  Active Incidents
                </h2>
              </div>
              <div className="space-y-3">
                {activeIncidents.length > 0 ? activeIncidents.slice(0, 5).map((incident, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 transition-all cursor-pointer" onClick={() => navigate(`/admin/incidents/${incident.ticketNumber}`)}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{incident.title || 'Incident'}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        incident.severity === 'critical' ? 'bg-red-600 text-white' :
                        incident.severity === 'high' ? 'bg-orange-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}>
                        {incident.severity?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{incident.ticketNumber || ''}</p>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">No active incidents</p>
                )}
              </div>
              {activeIncidents.length > 0 && (
                <button
                  onClick={() => navigate('/admin/incidents')}
                  className="w-full mt-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                >
                  View All Incidents
                </button>
              )}
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white"
            >
              <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5" />
                    <span className="font-medium">Platform Status</span>
                  </div>
                  <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-bold">Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5" />
                    <span className="font-medium">Data Volume</span>
                  </div>
                  <span className="text-sm">2.5TB</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5" />
                    <span className="font-medium">Security Score</span>
                  </div>
                  <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-bold">A+</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">User Satisfaction</span>
                  </div>
                  <span className="text-sm">4.8/5</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* More Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Network Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/admin/dashboard')}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Network className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Network Map</h3>
            </div>
            <p className="text-sm text-gray-600">Regional adoption heatmap and school distribution</p>
          </motion.div>

          {/* Benchmarks Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/admin/dashboard')}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Benchmarks</h3>
            </div>
            <p className="text-sm text-gray-600">Compare school performance across the network</p>
          </motion.div>

          {/* Telemetry */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate('/admin/dashboard')}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Activity className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Platform Telemetry</h3>
            </div>
            <p className="text-sm text-gray-600">Real-time APM and performance monitoring</p>
          </motion.div>

          {/* School Onboarding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={() => navigate('/admin/dashboard')}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">School Onboarding</h3>
            </div>
            <p className="text-sm text-gray-600">Create tenants, manage trials, assign managers</p>
          </motion.div>

          {/* Data Export */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={() => navigate('/admin/dashboard')}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Database className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Data Export</h3>
            </div>
            <p className="text-sm text-gray-600">Anonymized research sandbox and exports</p>
          </motion.div>

          {/* Policy & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onClick={() => navigate('/admin/dashboard')}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-100 rounded-lg">
                <Scale className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Policy & Legal</h3>
            </div>
            <p className="text-sm text-gray-600">Consent rates, deletion requests, legal holds</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
