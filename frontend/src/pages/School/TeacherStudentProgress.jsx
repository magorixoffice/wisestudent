import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Loader, TrendingUp, Coins, Flame, Award, 
  Calendar, Activity, Brain, Heart, Target, Users
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

// Import parent dashboard components (reuse them)
import { 
  ChildInfoCard, 
  SnapshotKPIsStrip, 
  MoodWithPromptsCard,
  ActivityTimelineCard,
  DetailedProgressReportCard,
  WalletRewardsCard,
  DigitalTwinGrowthCard,
  SkillsDistributionCard,
  HomeSupportPlanCard,
  MessagesCard
} from '../Parent/ParentDashboard';

const TeacherStudentProgress = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchStudentAnalytics();
    }
  }, [studentId]);

  const fetchStudentAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/school/teacher/student/${studentId}/analytics`);
      
      // Extract data from response (matches parent endpoint structure)
      const data = response.data;
      
      setStudent({
        ...data.student,
        ...data.childCard, // Include childCard data
        level: data.level,
        xp: data.xp,
        streak: data.streak,
        healCoins: typeof data.healCoins === 'object' 
          ? (data.healCoins?.currentBalance || 0)
          : (data.healCoins || 0)
      });
      
      setAnalytics(data); // Store entire response for components to use
    } catch (error) {
      console.error('Error fetching student analytics:', error);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-slate-600 font-medium">Loading student progress data...</p>
        </div>
      </div>
    );
  }

  if (!student || !analytics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Student Not Found</h2>
          <p className="text-slate-600 mb-6">
            The student you're looking for doesn't exist or you don't have access to view their progress.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/school-teacher/students')}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-md transition-all"
          >
            Back to All Students
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -4 }}
            onClick={() => navigate('/school-teacher/students')}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors mb-6 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to All Students</span>
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Student Progress Report
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Comprehensive analytics and insights for <span className="font-bold text-slate-900">{student.name}</span>
            </p>
          </motion.div>
        </div>

        {/* Student Info Card */}
        <div className="mb-6">
          <ChildInfoCard childCard={analytics?.childCard || student} studentId={studentId} />
        </div>

        {/* KPIs Strip */}
        <div className="mb-8">
          <SnapshotKPIsStrip 
            kpis={analytics?.snapshotKPIs} 
            level={analytics?.level || student.level}
            xp={analytics?.xp || student.xp}
            streak={analytics?.streak || student.streak}
            healCoins={
              typeof analytics?.healCoins === 'object' 
                ? (analytics?.healCoins?.currentBalance || 0)
                : (analytics?.healCoins || student.healCoins || 0)
            }
          />
        </div>

        {/* Detailed Progress & Wallet */}
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6 mb-8">
          <DetailedProgressReportCard progressReport={analytics?.detailedProgressReport} />
          <WalletRewardsCard
            walletRewards={analytics?.walletRewards}
            onViewDetails={() => navigate(`/school-teacher/student/${studentId}/wallet`)}
          />
        </div>

        {/* Digital Twin Growth & Skills Distribution */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <DigitalTwinGrowthCard 
            digitalTwinData={analytics?.digitalTwinData} 
            skillsDistribution={analytics?.skillsDistribution}
          />
          <SkillsDistributionCard 
            skillsDistribution={analytics?.skillsDistribution} 
          />
        </div>

        {/* Mood Summary with Conversation Prompts */}
        <div className="mb-8">
          <MoodWithPromptsCard moodSummary={analytics?.moodSummary} />
        </div>

        {/* Messages/Notifications */}
        {analytics?.messages && analytics.messages.length > 0 && (
          <div className="mb-8">
            <MessagesCard messages={analytics.messages} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherStudentProgress;

