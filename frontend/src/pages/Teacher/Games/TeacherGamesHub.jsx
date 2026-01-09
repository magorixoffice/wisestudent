import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, Gamepad2, Sparkles, Heart, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useWallet } from "../../../context/WalletContext";
import { useAuth } from "../../../hooks/useAuth";

const TeacherGamesHub = () => {
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const { user } = useAuth();

  const gameCategories = [
    {
      id: 'mental-health-emotional-regulation',
      title: 'Mental Health & Emotional Regulation',
      description: 'Core self-awareness and stress balance for teachers.',
      icon: <Brain className="w-8 h-8" />,
      gradient: 'from-indigo-600 via-purple-600 to-pink-600',
      hoverGradient: 'from-indigo-500 via-purple-500 to-pink-500',
      bgGradient: 'from-indigo-50 via-purple-50 to-pink-50',
      borderColor: 'border-indigo-200',
      gamesCount: 19,
      emoji: '🧠'
    },
    // Future categories can be added here
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <Gamepad2 className="w-8 h-8" />
                  Teacher Games
                </h1>
                <p className="text-sm text-white/90">
                  Welcome back, {user?.name?.split(" ")[0] || "Teacher"}! 👋 Learn and grow with interactive educational games
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-lg">
                    {wallet?.balance || 0} CalmCoins
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate(`/school-teacher/games/${category.id}`)}
              className={`group relative overflow-hidden rounded-xl border-2 ${category.borderColor} bg-gradient-to-br ${category.bgGradient} shadow-lg cursor-pointer transition-all hover:shadow-2xl hover:border-indigo-400`}
            >
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent rounded-full blur-xl"></div>
              </div>
              
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white shadow-lg`}
                  >
                    {category.icon}
                  </motion.div>
                  <span className="text-3xl">{category.emoji}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
                  {category.title}
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/50">
                  <span className="text-sm font-semibold text-slate-700 bg-white/60 px-3 py-1 rounded-full">
                    {category.gamesCount} {category.gamesCount === 1 ? 'game' : 'games'} available
                  </span>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={`p-2 rounded-lg bg-gradient-to-br ${category.gradient} text-white shadow-md`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.hoverGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Why Play These Games?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                These interactive games help you develop emotional intelligence, manage stress, and create a more positive classroom environment. 
                Earn CalmCoins by completing games and improve your teaching practice while taking care of your mental wellbeing.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherGamesHub;

