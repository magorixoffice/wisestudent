import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  Coins,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpCircle,
  ArrowDownCircle,
  Trophy,
  RefreshCw,
  Filter,
  ArrowUp,
  ArrowDown,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import {
  WalletRewardsCard,
  HealCoinsCard
} from "../Parent/ParentDashboard";

const TeacherStudentWalletRewards = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (studentId) {
      fetchStudentAnalytics();
      fetchTransactions();
    }
  }, [studentId]);

  useEffect(() => {
    if (studentId) {
      fetchTransactions(1);
    }
  }, [filters, studentId]);

  const fetchStudentAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/school/teacher/student/${studentId}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching student analytics:", error);
      toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = useCallback(async (page = 1) => {
    try {
      setTransactionsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20"
      });

      if (filters.type) params.append("type", filters.type);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const response = await api.get(`/api/school/teacher/student/${studentId}/transactions?${params.toString()}`);

      if (response.data) {
        setTransactions(response.data.transactions || []);
        setPagination(response.data.pagination || pagination);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setTransactionsLoading(false);
    }
  }, [studentId, filters, pagination]);

  const handleRefresh = () => {
    fetchStudentAnalytics();
    fetchTransactions(pagination.currentPage);
    toast.success("Data refreshed");
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ type: "", startDate: "", endDate: "" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Failed to load wallet data</p>
          <button
            onClick={() => navigate(`/school-teacher/student/${studentId}/progress`)}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to Student Progress
          </button>
        </div>
      </div>
    );
  }

  const { childCard, walletRewards, healCoins, detailedProgressReport } = analytics;

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
            <button
              onClick={() => navigate(`/school-teacher/student/${studentId}/progress`)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Student Progress</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <Wallet className="w-6 h-6" />
                Wallet & Rewards Tracking
              </h1>
              <p className="text-sm text-white/80">
                Monitor {childCard?.name || "this student"}'s HealCoins earnings and spending
              </p>
            </div>
          </div>
        </motion.div>

        {/* Wallet Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-600 mb-1">Current Balance</p>
            <p className="text-2xl font-bold text-emerald-600">{healCoins?.currentBalance || 0}</p>
            <p className="text-xs text-slate-500 mt-1">HealCoins</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ArrowUpCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-600 mb-1">Weekly Earned</p>
            <p className="text-2xl font-bold text-blue-600">{healCoins?.weeklyEarned || 0}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              This week
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                <ArrowDownCircle className="w-5 h-5 text-rose-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-600 mb-1">Weekly Spent</p>
            <p className="text-2xl font-bold text-rose-600">{healCoins?.weeklySpent || 0}</p>
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Redemptions
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-slate-600 mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-amber-600">
              {(detailedProgressReport?.weeklyCoins || 0) + (detailedProgressReport?.monthlyCoins || 0)}
            </p>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </div>
        </motion.div>

        {/* Wallet Rewards Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <WalletRewardsCard walletRewards={walletRewards} />
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Transaction History
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                onClick={handleRefresh}
                disabled={transactionsLoading}
                className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${transactionsLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All</option>
                    <option value="credit">Earned</option>
                    <option value="debit">Spent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {transactionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"
              />
            </div>
          ) : transactions.length > 0 ? (
            <>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.map((transaction, idx) => (
                  <motion.div
                    key={transaction._id || idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      transaction.type === "credit"
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-rose-50 border-rose-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === "credit"
                          ? "bg-emerald-100"
                          : "bg-rose-100"
                      }`}>
                        {transaction.type === "credit" ? (
                          <ArrowUp className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate">
                          {transaction.description || "Transaction"}
                        </p>
                        <p className="text-xs text-slate-600">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${
                        transaction.type === "credit"
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}>
                        {transaction.type === "credit" ? "+" : "-"}
                        {Math.abs(transaction.amount || 0)}
                      </p>
                      <p className="text-xs text-slate-500">HealCoins</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                  <div className="text-sm text-slate-600">
                    Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => fetchTransactions(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage || transactionsLoading}
                      className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-slate-700">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => fetchTransactions(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage || transactionsLoading}
                      className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">No transactions found</p>
              {(filters.type || filters.startDate || filters.endDate) ? (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear filters to see all transactions
                </button>
              ) : null}
            </div>
          )}
        </motion.div>

        {/* HealCoins Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HealCoinsCard healCoins={healCoins} />
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherStudentWalletRewards;
