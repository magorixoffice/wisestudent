import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import {
  Bell,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Check,
  X,
  ChevronDown,
  Filter,
  MoreVertical,
  RefreshCw,
  Clock,
  CheckSquare,
  Square,
  Award,
  Zap,
  MessageCircle,
  Calendar,
  User,
  FileText,
  Gift,
  Heart,
  Star,
  Shield,
  Bookmark,
  Flag,
  Settings,
  HelpCircle,
  Inbox,
  Send,
  Eye,
  EyeOff,
  Search,
  ArrowUp,
  ArrowDown,
  Loader,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { useSocket } from "../context/SocketContext";

const notificationTypes = {
  info: {
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    gradient: "from-blue-500 to-indigo-500",
  },
  success: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    gradient: "from-green-500 to-emerald-500",
  },
  warning: {
    icon: AlertCircle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    gradient: "from-yellow-500 to-amber-500",
  },
  alert: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    gradient: "from-red-500 to-pink-500",
  },
};

const getNotificationIcon = (notification) => {
  // Default to info type
  let type = "info";

  // Determine type based on content
  const content = (notification.content || "").toLowerCase();
  if (content.includes("congratulations") || 
      content.includes("completed") ||
      content.includes("achieved") ||
      content.includes("success")) {
    type = "success";
  } else if (content.includes("warning") ||
           content.includes("reminder") ||
           content.includes("approaching")) {
    type = "warning";
  } else if (content.includes("failed") ||
           content.includes("error") ||
           content.includes("urgent") ||
           content.includes("critical")) {
    type = "alert";
  }

  // Override with specific icons based on categories
  if (notification.category === "achievement") {
    return { icon: Award, type };
  } else if (notification.category === "message") {
    return { icon: MessageCircle, type };
  } else if (notification.category === "event") {
    return { icon: Calendar, type };
  } else if (notification.category === "user") {
    return { icon: User, type };
  } else if (notification.category === "document") {
    return { icon: FileText, type };
  } else if (notification.category === "reward") {
    return { icon: Gift, type };
  } else if (notification.category === "like") {
    return { icon: Heart, type };
  } else if (notification.category === "rating") {
    return { icon: Star, type };
  } else if (notification.category === "security") {
    return { icon: Shield, type };
  } else if (notification.category === "bookmark") {
    return { icon: Bookmark, type };
  } else if (notification.category === "report") {
    return { icon: Flag, type };
  } else if (notification.category === "settings") {
    return { icon: Settings, type };
  } else if (notification.category === "help") {
    return { icon: HelpCircle, type };
  } else if (notification.category === "inbox") {
    return { icon: Inbox, type };
  } else if (notification.category === "outbox") {
    return { icon: Send, type };
  }

  // Default icon based on type
  return { icon: notificationTypes[type].icon, type };
};

const Notifications = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/notifications');

      if (response.status !== 200) {
        throw new Error("Failed to fetch notifications");
      }

      const raw = Array.isArray(response.data)
        ? response.data
        : (response.data.notifications || []);

      const mapped = raw.map(n => ({
        id: n._id || n.id,
        title: n.title || 'Notification',
        content: n.message || n.content || '',
        timestamp: n.createdAt || n.timestamp || new Date().toISOString(),
        read: n.isRead ?? n.read ?? false,
        category: (() => {
          const t = (n.type || '').toString();
          if (t.includes('assignment_approval')) return 'report';
          if (t.includes('policy_change')) return 'alert';
          if ((n.message || '').startsWith('Message from')) return 'message';
          return 'info';
        })()
      }));

      setNotifications(mapped);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again later.");
      // Use mock data as fallback
      setNotifications([
        {
          id: "1",
          title: "New Achievement Unlocked",
          content: "Congratulations! You've earned the 'Early Bird' badge for completing 5 morning check-ins.",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: false,
          category: "achievement",
          actionUrl: "/student/achievements"
        },
        {
          id: "2",
          title: "Weekly Progress Report",
          content: "Your weekly wellness report is now available. You've improved by 15% since last week!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          read: true,
          category: "report",
          actionUrl: "/student/progress"
        },
        {
          id: "3",
          title: "New Message from Counselor",
          content: "Dr. Smith has sent you a new message regarding your recent mood patterns.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          read: false,
          category: "message",
          actionUrl: "/student/messages"
        },
        {
          id: "4",
          title: "Upcoming Event",
          content: "Reminder: Virtual Wellness Workshop starts tomorrow at 3 PM.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
          read: true,
          category: "event",
          actionUrl: "/student/events"
        },
        {
          id: "5",
          title: "Streak Alert",
          content: "Warning: You're about to break your 7-day check-in streak! Don't forget to log your mood today.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
          read: false,
          category: "alert",
          actionUrl: "/student/mood-check"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Client-side auto-prune to reflect TTL deletions without refresh
  useEffect(() => {
    const ttlSeconds = 1296000; // 15 days
    const prune = () => {
      const now = Date.now();
      setNotifications(prev => prev.filter(n => {
        const ts = new Date(n.timestamp).getTime();
        return now - ts < ttlSeconds * 1000;
      }));
    };
    const timer = setInterval(prune, 300000); // Check every 5 minutes
    return () => clearInterval(timer);
  }, []);

  // Realtime socket removal if server emits notification_deleted
  useEffect(() => {
    if (!socket) return;

    const onNotificationDeleted = ({ id }) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id && n._id !== id));
    };

    socket.on("notification_deleted", onNotificationDeleted);

    return () => {
      socket.off("notification_deleted", onNotificationDeleted);
    };
  }, [socket]);

  const markAsRead = async (id) => {
    try {
      const response = await api.patch(`/api/notifications/${id}/read`);

      if (response.status !== 200) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await api.patch('/api/notifications/read-all');

      if (response.status !== 200) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await api.delete(`/api/notifications/${id}`);

      if (response.status !== 200) {
        throw new Error("Failed to delete notification");
      }

      setNotifications(notifications.filter(notification => notification.id !== id));
      setSelectedNotifications(selectedNotifications.filter(notificationId => notificationId !== id));
      toast.success("Notification deleted");
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error("Failed to delete notification");
    }
  };

  const deleteSelectedNotifications = async () => {
    try {
      const response = await api.delete('/api/notifications/batch', {
        data: { ids: selectedNotifications }
      });

      if (response.status !== 200) {
        throw new Error("Failed to delete selected notifications");
      }

      setNotifications(notifications.filter(notification => !selectedNotifications.includes(notification.id)));
      setSelectedNotifications([]);
      toast.success("Selected notifications deleted");
    } catch (err) {
      console.error("Error deleting selected notifications:", err);
      toast.error("Failed to delete selected notifications");
    }
  };

  const toggleSelection = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notificationId => notificationId !== id) 
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(notification => notification.id));
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate to the action URL if available
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "newest" ? "oldest" : "newest");
  };

  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === "all") return true;
      if (filter === "unread") return !notification.read;
      if (filter === "read") return notification.read;
      return true;
    })
    .filter(notification => {
      if (!searchQuery) return true;
      return (
        (notification.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (notification.content || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
      return "just now";
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          animate={{
            x: [0, 30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute top-20 -right-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Bell className="w-8 h-8" />
            </motion.div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-black mb-2 flex items-center justify-center gap-2 text-center">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-red-500 rounded-full"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </h1>

              <p className="text-gray-600 text-lg font-medium">
                Stay updated with your latest activities
              </p>
            </div>
          </div>
        </motion.div>

        {/* Notification Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={selectAll}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Select all"
              >
                {selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0 ? (
                  <CheckSquare className="w-5 h-5 text-indigo-500" />
                ) : (
                  <Square className="w-5 h-5 text-gray-500" />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="More actions"
                  disabled={selectedNotifications.length === 0}
                >
                  <MoreVertical className={`w-5 h-5 ${selectedNotifications.length === 0 ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>

                <AnimatePresence>
                  {showActions && selectedNotifications.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10"
                    >
                      <button
                        onClick={markAllAsRead}
                        className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-gray-100 transition-colors rounded-t-xl"
                      >
                        <Eye className="w-4 h-4 text-indigo-500" />
                        <span>Mark as read</span>
                      </button>
                      <button
                        onClick={deleteSelectedNotifications}
                        className="w-full text-left px-4 py-3 flex items-center gap-2 text-red-500 hover:bg-red-50 transition-colors rounded-b-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete selected</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={fetchNotifications}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-gray-500" />
              </button>

              <button
                onClick={toggleSortOrder}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
                aria-label="Sort order"
              >
                <Clock className="w-5 h-5 text-gray-500" />
                {sortOrder === "newest" ? (
                  <ArrowDown className="w-3 h-3 text-gray-500" />
                ) : (
                  <ArrowUp className="w-3 h-3 text-gray-500" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearching(true)}
                  onBlur={() => setIsSearching(false)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm transition-all"
                />
                <Search className={`absolute left-3 top-2.5 w-4 h-4 ${isSearching ? 'text-indigo-500' : 'text-gray-400'}`} />
              </div>

              <div className="relative">
                <button
                  onClick={() => setFilter(prev => prev === "all" ? "unread" : prev === "unread" ? "read" : "all")}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white/50 backdrop-blur-sm"
                >
                  <Filter className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {filter === "all" ? "All" : filter === "unread" ? "Unread" : "Read"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={fetchNotifications}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {searchQuery
                  ? "No notifications match your search"
                  : filter === "unread"
                  ? "No unread notifications"
                  : filter === "read"
                  ? "No read notifications"
                  : "No notifications yet"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => {
                const { icon: IconComponent, type } = getNotificationIcon(notification);
                const typeConfig = notificationTypes[type];

                return (
                  <motion.li
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className={`relative ${notification.read ? '' : `${typeConfig.bgColor} border-l-4 ${typeConfig.borderColor}`}`}
                  >
                    <div className="flex items-start p-4 sm:p-6">
                      <div className="flex-shrink-0 mr-4">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => toggleSelection(notification.id)}
                          className="h-5 w-5 text-indigo-500 focus:ring-indigo-400 border-gray-300 rounded"
                        />
                      </div>

                      <div
                        className={`flex-shrink-0 mr-4 p-2 rounded-xl ${typeConfig.bgColor}`}
                      >
                        <IconComponent className={`w-6 h-6 ${typeConfig.color}`} />
                      </div>

                      <div className="flex-1 cursor-pointer" onClick={() => handleNotificationClick(notification)}>
                        <div className="flex items-center justify-between">
                          <h3 className={`text-base font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        <p className={`mt-1 text-sm ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                          {notification.content}
                        </p>
                      </div>

                      <div className="ml-4 flex-shrink-0 flex items-start space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Mark as read"
                          >
                            <Eye className="w-5 h-5 text-gray-400 hover:text-indigo-500" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </motion.div>

        {/* Action Buttons */}
        {filteredNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex justify-center gap-4"
          >
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={markAllAsRead}
                className="px-6 py-3 bg-indigo-500 text-white rounded-xl shadow-lg flex items-center gap-2 hover:bg-indigo-600 transition-colors"
              >
                <Check className="w-5 h-5" />
                Mark All as Read
              </motion.button>
            )}

            {selectedNotifications.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={deleteSelectedNotifications}
                className="px-6 py-3 bg-red-500 text-white rounded-xl shadow-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Delete Selected ({selectedNotifications.length})
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
