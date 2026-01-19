import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import api from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    Coins,
    TrendingUp,
    TrendingDown,
    Gift,
    Search,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    Sparkles,
    Star,
    Crown,
    Trophy,
    Zap,
    CheckCircle,
    History,
    Target,
    Award,
    DollarSign,
    Eye,
    EyeOff,
    Send,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useSocket } from '../../context/SocketContext';
import { toast } from 'react-hot-toast';
import { createPortal } from "react-dom";
import { useAuth } from "../../hooks/useAuth";

const HealCoinIcon = ({ className = "w-5 h-5" }) => (
    <img
        src="/healcoin.png"
        alt="HealCoin"
        className={`inline-block ${className}`}
        loading="lazy"
    />
);

const HEALCOIN_TO_RUPEE_RATE = 0.01;

const formatRupee = (value) => {
    const normalizedValue = typeof value === "number" ? value : Number(value) || 0;
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(normalizedValue);
};

const INITIAL_ADDRESS_FORM = {
    name: "",
    contactNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    instructions: ""
};

const WalletPage = () => {
    const [wallet, setWallet] = useState({
        balance: 0,
        totalXP: 0,
        lastUpdated: new Date().toISOString(),
        rank: 0,
        nextMilestone: 100,
        achievements: []
    });
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [fetching, setFetching] = useState(false);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [statusMsg, setStatusMsg] = useState("");
    const [selectedGoodie, setSelectedGoodie] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState(INITIAL_ADDRESS_FORM);
    const [addressErrors, setAddressErrors] = useState({});
    const [isSubmittingGoodie, setIsSubmittingGoodie] = useState(false);
    const [goodies, setGoodies] = useState([]);
    const [goodiesLoading, setGoodiesLoading] = useState(true);
    const bodyOverflowRef = useRef("");

    const [errorMsg, setErrorMsg] = useState("");
    const [showBalance, setShowBalance] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    const { user } = useAuth();
    
    const fetchTransactions = useCallback(async (page = 1) => {
        try {
            const transactionsResponse = await api.get(`/api/wallet/transactions?page=${page}&limit=10`);
            if (transactionsResponse.data && transactionsResponse.data.transactions) {
                // New API format with pagination
                const txns = Array.isArray(transactionsResponse.data.transactions) 
                    ? transactionsResponse.data.transactions 
                    : [];
                setTransactions(txns);
                setPagination(transactionsResponse.data.pagination || {
                    currentPage: page,
                    totalPages: 1,
                    totalCount: transactionsResponse.data.transactions?.length || 0,
                    limit: 10,
                    hasNextPage: false,
                    hasPrevPage: false
                });
            } else if (Array.isArray(transactionsResponse.data)) {
                // Fallback for old API format (array directly)
                setTransactions(transactionsResponse.data);
                setPagination({
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: transactionsResponse.data?.length || 0,
                    limit: 10,
                    hasNextPage: false,
                    hasPrevPage: false
                });
            } else {
                setTransactions([]);
                setPagination({
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: 0,
                    limit: 10,
                    hasNextPage: false,
                    hasPrevPage: false
                });
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
            setPagination({
                currentPage: 1,
                totalPages: 1,
                totalCount: 0,
                limit: 10,
                hasNextPage: false,
                hasPrevPage: false
            });
        }
    }, []);
    
    const fetchWalletData = useCallback(async () => {
        setFetching(true);
        setErrorMsg("");
        try {
            const walletResponse = await api.get('/api/wallet');
            // Update lastUpdated to current time for real-time display
            const walletData = {
                balance: walletResponse.data?.balance || 0,
                totalXP: walletResponse.data?.totalXP || 0,
                lastUpdated: new Date().toISOString(),
                rank: walletResponse.data?.rank || 0,
                nextMilestone: walletResponse.data?.nextMilestone || 100,
                achievements: Array.isArray(walletResponse.data?.achievements) ? walletResponse.data.achievements : []
            };
            setWallet(walletData);
            
            // Fetch transactions for current page (don't fail if this fails)
            try {
                await fetchTransactions(currentPage);
            } catch (txnError) {
                console.error('Error fetching transactions:', txnError);
                // Continue even if transactions fail
            }
        } catch (error) {
            console.error('Error fetching wallet data:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to load wallet data';
            setErrorMsg(errorMessage);
            toast.error(errorMessage);
        } finally {
            setFetching(false);
        }
    }, [currentPage, fetchTransactions]);

    const loadGoodies = useCallback(async () => {
        try {
            setGoodiesLoading(true);
            const response = await api.get('/api/goodies');
            const items = Array.isArray(response.data?.goodies) ? response.data.goodies : [];
            setGoodies(items);
        } catch (error) {
            console.error('Failed to load goodies:', error);
            toast.error('Failed to load goodies');
        } finally {
            setGoodiesLoading(false);
        }
    }, []);

    const openGoodieModal = (goodie) => {
        if (!goodie) return;
        if ((wallet?.balance || 0) < goodie.coins) {
            toast.error(`You need ${goodie.coins.toLocaleString()} HealCoins to request ${goodie.title}.`);
            return;
        }
        setSelectedGoodie(goodie);
        setAddressForm({
            ...INITIAL_ADDRESS_FORM,
            name: user?.name || "",
            contactNumber: user?.contactNumber || user?.phone || ""
        });
        setAddressErrors({});
        setShowAddressModal(true);
    };

    const closeGoodieModal = () => {
        setShowAddressModal(false);
        setSelectedGoodie(null);
        setAddressErrors({});
        setAddressForm(INITIAL_ADDRESS_FORM);
    };

    const handleAddressChange = (field, value) => {
        setAddressForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const submitGoodieRequest = async () => {
        if (!selectedGoodie) return;
        const errors = {};
        if (!addressForm.name.trim()) errors.name = "Full name is required";
        if (!addressForm.contactNumber.trim()) errors.contactNumber = "Contact number is required";
        if (!addressForm.addressLine1.trim()) errors.addressLine1 = "Address line 1 is required";
        if (!addressForm.city.trim()) errors.city = "City is required";
        if (!addressForm.state.trim()) errors.state = "State is required";
        if (!addressForm.pincode.trim()) errors.pincode = "Pincode is required";

        if (Object.keys(errors).length) {
            setAddressErrors(errors);
            return;
        }

        setIsSubmittingGoodie(true);
        try {
            const response = await api.post('/api/goodies/request', {
                goodieTitle: selectedGoodie.title,
                coins: selectedGoodie.coins,
                description: selectedGoodie.description || "",
                address: {
                    contactNumber: addressForm.contactNumber,
                    addressLine1: addressForm.addressLine1,
                    addressLine2: addressForm.addressLine2,
                    city: addressForm.city,
                    state: addressForm.state,
                    pincode: addressForm.pincode,
                    instructions: addressForm.instructions
                }
            });

            const newBalance = response.data.walletBalance ?? Math.max(0, (wallet.balance || 0) - selectedGoodie.coins);
            setWallet(prev => ({
                ...prev,
                balance: newBalance,
                lastUpdated: new Date().toISOString()
            }));

            setStatusMsg(`Thanks! ${selectedGoodie.title} request submitted (ID ${response.data.order?._id || 'pending'}).`);
            toast.success("Goodie request submitted! We'll deliver soon.");
            closeGoodieModal();
            setTimeout(() => setStatusMsg(""), 6000);
        } catch (error) {
            console.error("Goodie request failed:", error);
            const message = error.response?.data?.error || 'Failed to submit goodie request';
            toast.error(message);
        } finally {
            setIsSubmittingGoodie(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, [fetchWalletData]);
    
    useEffect(() => {
        loadGoodies();
    }, [loadGoodies]);
    
    // Fetch transactions when page changes
    useEffect(() => {
        if (activeTab === 'transactions') {
            fetchTransactions(currentPage);
        }
    }, [currentPage, activeTab, fetchTransactions]);
    const { socket } = useSocket();
    useEffect(() => {
        if (!socket) return;
        const handleGameCompleted = async (data) => {
            // Optimistically update balance
            setWallet((prev) => ({ 
                ...prev, 
                balance: data.newBalance || (prev.balance || 0) + (data.coinsEarned || 0),
                lastUpdated: new Date().toISOString()
            }));
            toast.success(`🎮 Game completed! +${data.coinsEarned || 0} HealCoins`);
            // Refresh full wallet data to get updated stats including rank
            setTimeout(() => fetchWalletData(), 500);
        };
        const handleChallengeCompleted = async (data) => {
            // Optimistically update balance
            setWallet((prev) => ({ 
                ...prev, 
                balance: (prev.balance || 0) + (data.rewards?.coins || 0),
                lastUpdated: new Date().toISOString()
            }));
            toast.success(`🏆 Challenge completed! +${data.rewards?.coins || 0} HealCoins`);
            // Refresh full wallet data to get updated stats including rank
            setTimeout(() => fetchWalletData(), 500);
        };
        const handleWalletUpdate = async (data) => {
            // When wallet is updated, refresh to get updated rank
            if (data?.balance !== undefined || data?.newBalance !== undefined) {
                setTimeout(() => fetchWalletData(), 300);
            }
        };
        const handleNewGoodieCatalog = (goodie) => {
            setGoodies((prev) => {
                if (prev.some((item) => item._id === goodie._id)) {
                    return prev;
                }
                return [goodie, ...prev];
            });
        };
        socket.on('game-completed', handleGameCompleted);
        socket.on('challenge-completed', handleChallengeCompleted);
        socket.on('wallet:updated', handleWalletUpdate);
        socket.on('goodie:catalog:new', handleNewGoodieCatalog);
        return () => {
            socket.off('game-completed', handleGameCompleted);
            socket.off('challenge-completed', handleChallengeCompleted);
            socket.off('wallet:updated', handleWalletUpdate);
            socket.off('goodie:catalog:new', handleNewGoodieCatalog);
        };
    }, [socket, fetchWalletData]);
    
    // Periodically refresh wallet data (including rank) every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            // Only refresh if not currently fetching and page is visible
            if (!fetching && document.visibilityState === 'visible') {
                fetchWalletData();
            }
        }, 30000); // Refresh every 30 seconds
        
        return () => clearInterval(interval);
    }, [fetching, fetchWalletData]);

    useEffect(() => {
        if (typeof document === "undefined") return;

        if (showAddressModal) {
            bodyOverflowRef.current = document.body.style.overflow;
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = bodyOverflowRef.current || "";
        }

        return () => {
            document.body.style.overflow = bodyOverflowRef.current || "";
        };
    }, [showAddressModal]);

    // Animation variants
    const pulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    // Filter and sort transactions - ensure transactions is always an array
    const filteredTxns = useMemo(() => {
        const transactionsArray = Array.isArray(transactions) ? transactions : [];
        return transactionsArray
            .filter((txn) => {
                if (!txn || typeof txn !== 'object') return false;
                const matchesSearch = txn.description
                    ?.toLowerCase()
                    .includes(search.toLowerCase());
                // Map transaction types for filtering
                let txnType = txn.type;
                if (txnType === "earn") txnType = "credit";
                if (txnType === "spend") txnType = "debit";
                
                const matchesType = typeFilter === "all" || txnType === typeFilter;
                return matchesSearch && matchesType;
            })
            .sort((a, b) => {
                const dateA = new Date(a.createdAt || a.timestamps?.createdAt || 0);
                const dateB = new Date(b.createdAt || b.timestamps?.createdAt || 0);
                return sortBy === "newest"
                    ? dateB - dateA
                    : dateA - dateB;
            });
    }, [transactions, search, typeFilter, sortBy]);

    const getTransactionIcon = (type) => {
        switch (type) {
            case "credit":
            case "earn":
                return <ArrowUpRight className="w-5 h-5 text-green-500" />;
            case "debit":
            case "spend":
                return <ArrowDownLeft className="w-5 h-5 text-red-500" />;
            case "redeem":
                return <Send className="w-5 h-5 text-blue-500" />;
            default:
                return <Coins className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "text-green-600 bg-green-100";
            case "pending":
                return "text-yellow-600 bg-yellow-100";
            case "failed":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not available";
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
            if (diffInHours < 1) return "Just now";
            if (diffInHours < 24) return `${diffInHours}h ago`;
            if (diffInHours < 48) return "Yesterday";
            return date.toLocaleDateString();
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid date";
        }
    };

    const progressToMilestone = wallet?.balance && wallet?.nextMilestone && wallet.nextMilestone > 0
        ? Math.min(((wallet.balance / wallet.nextMilestone) * 100), 100)
        : 0;

    const rupeesForBalance = (wallet.balance || 0) * HEALCOIN_TO_RUPEE_RATE;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden px-4 sm:px-6 md:px-8">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000 hidden sm:block" />
                <div className="absolute bottom-20 left-1/4 w-56 sm:w-72 h-56 sm:h-72 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000 hidden md:block" />
                {/* Floating coin elements */}
                <motion.div
                    className="absolute top-1/4 left-1/3 w-6 sm:w-8 h-6 sm:h-8 bg-yellow-400 rounded-full opacity-60 flex items-center justify-center text-white font-bold hidden sm:flex"
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    🪙
                </motion.div>
                <motion.div
                    className="absolute top-2/3 right-1/4 w-5 sm:w-6 h-5 sm:h-6 bg-green-400 rounded-full opacity-50 flex items-center justify-center text-white text-xs font-bold hidden sm:flex"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 360, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                >
                    💰
                </motion.div>
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Error Message */}
                {errorMsg && !fetching && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                    >
                        {errorMsg}
                    </motion.div>
                )}
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-6 sm:mb-8"
                >
                    <motion.div
                        className="relative inline-block"
                        variants={pulseVariants}
                        animate="animate"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-3 flex items-center justify-center gap-1 sm:gap-2 text-center">
                            <span className="text-black dark:text-white">💰</span>
                            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
                                HealCoin Wallet
                            </span>
                        </h1>

                        <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce hidden sm:block">
                            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                    </motion.div>
                    <motion.p
                        className="text-gray-600 text-base sm:text-lg md:text-xl font-medium tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Your wellness rewards, your way ✨
                    </motion.p>
                </motion.div>

                {/* Balance Overview */}
                {fetching && (
                    <div className="text-center py-8 mb-6">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="mt-2 text-gray-600">Loading wallet data...</p>
                    </div>
                )}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: fetching ? 0.5 : 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className={`bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl sm:shadow-2xl border border-white/50 mb-6 sm:mb-8 relative overflow-hidden ${fetching ? 'pointer-events-none' : ''}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/8 via-emerald-500/8 to-teal-500/8" />
                    <div className="relative z-10">
                        <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <motion.div
                                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg sm:shadow-xl"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Wallet className="w-6 h-6 sm:w-8 sm:h-8" />
                                </motion.div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Current Balance</h2>
                                    <p className="text-xs sm:text-sm text-gray-600">Last updated: {formatDate(wallet.lastUpdated)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={fetchWalletData}
                                    disabled={fetching}
                                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    title="Refresh wallet data"
                                >
                                    <motion.div
                                        animate={fetching ? { rotate: 360 } : {}}
                                        transition={{ duration: 1, repeat: fetching ? Infinity : 0, ease: "linear" }}
                                    >
                                        <History className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </motion.div>
                                </button>
                                <button
                                    onClick={() => setShowBalance(!showBalance)}
                                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                                    title={showBalance ? "Hide balance" : "Show balance"}
                                >
                                    {showBalance ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {/* Main Balance */}
                            <motion.div
                                className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-green-200 shadow-md sm:shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                        <span className="text-xs sm:text-sm font-bold text-green-700">HealCoins</span>
                                    </div>
                                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                                </div>
                                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-green-600 mb-1 sm:mb-2">
                                    {showBalance ? (
                                        <span className="inline-flex items-center gap-2">
                                            <HealCoinIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                            {wallet.balance?.toLocaleString() || '0'}
                                        </span>
                                    ) : (
                                        "••••"
                                    )}
                                </div>
                                <div className="text-xs sm:text-sm text-green-600 font-medium">Available Balance</div>
                            </motion.div>
                            {/* Total XP */}
                            <motion.div
                                className="bg-gradient-to-br from-blue-100 to-cyan-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-200 shadow-md sm:shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                        <span className="text-xs sm:text-sm font-bold text-blue-700">Total XP</span>
                                    </div>
                                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                                </div>
                                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-600 mb-1 sm:mb-2">
                                    {showBalance ? `${wallet.totalXP?.toLocaleString() || '0'} XP` : "••••"}
                                </div>
                                <div className="text-xs sm:text-sm text-blue-600 font-medium">All Time</div>
                            </motion.div>
                            {/* Next Milestone */}
                            <motion.div
                                className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-200 shadow-md sm:shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                                        <span className="text-xs sm:text-sm font-bold text-purple-700">Next Goal</span>
                                    </div>
                                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                                </div>
                                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-purple-600 mb-1 sm:mb-2">
                                    <span className="inline-flex items-center gap-2">
                                        <HealCoinIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                        {wallet.nextMilestone?.toLocaleString() || '100'}
                                    </span>
                                </div>
                                <div className="w-full bg-purple-200 rounded-full h-1.5 sm:h-2 mb-1 sm:mb-2">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressToMilestone}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </div>
                                <div className="text-xs sm:text-sm text-purple-600 font-medium">
                                    {Math.round(progressToMilestone)}% Complete
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-1 no-scrollbar">
                    {["overview", "transactions", "redeem"].map((tab) => (
                        <motion.button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                setErrorMsg("");
                                setStatusMsg("");
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all capitalize whitespace-nowrap ${activeTab === tab
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md sm:shadow-lg'
                                    : 'bg-white/80 text-gray-700 hover:bg-white shadow-sm sm:shadow-md'
                                }`}
                        >
                            {tab === "overview" && <Trophy className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />}
                            {tab === "transactions" && <History className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />}
                            {tab === "redeem" && <Gift className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />}
                            {tab}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Achievements */}
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl sm:shadow-2xl border border-white/50 mb-6 sm:mb-8">
                                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-1.5 sm:gap-2">
                                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                                    Your Achievements
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                    {wallet.achievements?.map((achievement, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            className="bg-gradient-to-br from-yellow-100 to-orange-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-yellow-200 shadow-md sm:shadow-lg text-center"
                                        >
                                            <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">{achievement.icon}</div>
                                            <h4 className="font-bold text-gray-800 mb-0.5 sm:mb-1 text-sm sm:text-base">{achievement.title}</h4>
                                            <p className="text-xs sm:text-sm text-gray-600">{achievement.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white shadow-lg sm:shadow-xl">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />
                                        <h3 className="text-lg sm:text-xl font-bold">Global Rank</h3>
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black">#{wallet.rank || 'N/A'}</div>
                                    <p className="text-green-100 text-xs sm:text-sm">Out of all users</p>
                                </div>
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 sm:p-6 rounded-2xl sm:rounded-3xl text-white shadow-lg sm:shadow-xl">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
                                        <h3 className="text-lg sm:text-xl font-bold">This Month</h3>
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black">
                                        <span className="inline-flex items-center gap-2">
                                            <HealCoinIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                            {Math.floor((wallet.balance || 0) * 0.3).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-purple-100 text-xs sm:text-sm">Earned in {new Date().toLocaleDateString('en-US', { month: 'long' })}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "transactions" && (
                        <motion.div
                            key="transactions"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Filters */}
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl sm:shadow-2xl border border-white/50 mb-4 sm:mb-6">
                                <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
                                    <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 w-full sm:w-auto mb-2 sm:mb-0">
                                        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search transactions..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base w-full"
                                        />
                                    </div>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value)}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-gray-200 bg-white shadow-sm outline-none text-sm sm:text-base flex-1 sm:flex-none"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="credit">💰 Earned</option>
                                        <option value="debit">💸 Spent</option>
                                        <option value="redeem">🎁 Redeemed</option>
                                    </select>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-gray-200 bg-white shadow-sm outline-none text-sm sm:text-base flex-1 sm:flex-none"
                                    >
                                        <option value="newest">⏰ Newest First</option>
                                        <option value="oldest">📅 Oldest First</option>
                                    </select>
                                </div>
                            </div>
                            {/* Transactions List */}
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-white/50 overflow-hidden">
                                <div className="p-4 sm:p-6 border-b border-gray-100">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-1.5 sm:gap-2">
                                            <History className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
                                            Transaction History
                                        </h3>
                                        <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                            Last 7 days
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    {filteredTxns.length === 0 ? (
                                        <div className="text-center py-8 sm:py-10 md:py-12">
                                            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🔍</div>
                                            <p className="text-gray-500 text-base sm:text-lg">No transactions found</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="divide-y divide-gray-100">
                                                {filteredTxns.map((txn) => (
                                                    <motion.div
                                                        key={txn._id}
                                                        whileHover={{ backgroundColor: "#f8fafc" }}
                                                        className="p-3 sm:p-4 md:p-6 flex items-center justify-between transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                                            <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md sm:shadow-lg ${
                                                                (txn.type === 'credit' || txn.type === 'earn') ? 'bg-green-100' :
                                                                (txn.type === 'debit' || txn.type === 'spend') ? 'bg-red-100' : 'bg-blue-100'
                                                            }`}>
                                                                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
                                                                    {getTransactionIcon(txn.type)}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm sm:text-base font-semibold text-gray-800">{txn.description || 'Transaction'}</h4>
                                                                <p className="text-xs sm:text-sm text-gray-500">{formatDate(txn.createdAt || txn.timestamps?.createdAt)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-base sm:text-lg md:text-xl font-bold ${
                                                                (txn.type === 'credit' || txn.type === 'earn') ? 'text-green-600' :
                                                                (txn.type === 'debit' || txn.type === 'spend') ? 'text-red-600' : 'text-blue-600'
                                                            }`}>
                                                                <span className="inline-flex items-center gap-2">
                                                                    {(txn.type === 'credit' || txn.type === 'earn') ? '+' : '-'}
                                                                    <HealCoinIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                                    {txn.amount?.toLocaleString() || 0}
                                                                </span>
                                                            </div>
                                                            <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${getStatusColor(txn.status || 'completed')}`}>
                                                                {txn.status || 'completed'}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            
                                            {/* Pagination Controls */}
                                            {pagination && pagination.totalPages > 1 && (
                                                <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                    <div className="text-sm text-gray-600">
                                                        Showing {((currentPage - 1) * (pagination?.limit || 10)) + 1} to {Math.min(currentPage * (pagination?.limit || 10), pagination?.totalCount || 0)} of {pagination?.totalCount || 0} transactions
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                const newPage = currentPage - 1;
                                                                setCurrentPage(newPage);
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }}
                                                            disabled={!pagination?.hasPrevPage}
                                                            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                                        >
                                                            <ChevronLeft className="w-4 h-4" />
                                                            Previous
                                                        </button>
                                                        
                                                        <div className="flex items-center gap-1">
                                                            {Array.from({ length: Math.min(5, pagination?.totalPages || 1) }, (_, i) => {
                                                                let pageNum;
                                                                const totalPages = pagination?.totalPages || 1;
                                                                if (totalPages <= 5) {
                                                                    pageNum = i + 1;
                                                                } else if (currentPage <= 3) {
                                                                    pageNum = i + 1;
                                                                } else if (currentPage >= totalPages - 2) {
                                                                    pageNum = totalPages - 4 + i;
                                                                } else {
                                                                    pageNum = currentPage - 2 + i;
                                                                }
                                                                
                                                                return (
                                                                    <button
                                                                        key={pageNum}
                                                                        onClick={() => {
                                                                            setCurrentPage(pageNum);
                                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                        }}
                                                                        className={`px-3 py-2 rounded-lg border transition-colors ${
                                                                            currentPage === pageNum
                                                                                ? 'bg-indigo-500 text-white border-indigo-500'
                                                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                                        }`}
                                                                    >
                                                                        {pageNum}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        
                                                        <button
                                                            onClick={() => {
                                                                const newPage = currentPage + 1;
                                                                setCurrentPage(newPage);
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }}
                                                            disabled={!pagination?.hasNextPage}
                                                            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                                        >
                                                            Next
                                                            <ChevronRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "redeem" && (
                        <motion.div
                            key="redeem"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl sm:shadow-2xl border border-white/50">
                                <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
                                    <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white to-slate-50 p-6 shadow-inner">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Redeem HealCoins</h3>
                                                <p className="text-sm text-gray-500 max-w-xl">
                                                    1,000 HealCoins = ₹10 credited to your wallet.
                                                    That's ₹0.01 for every HealCoin you earn.
                                                </p>
                                            </div>
                                            <Sparkles className="w-6 h-6 text-amber-500" />
                                        </div>

                                        <div className="mt-6 space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="bg-gradient-to-br from-green-100 via-emerald-100 to-lime-50 border border-green-200 rounded-2xl p-4 shadow-inner flex flex-col">
                                                    <span className="text-xs font-semibold uppercase tracking-wide text-green-600 mb-2">Current HealCoins</span>
                                                    <div className="flex items-center gap-2 text-2xl font-black text-gray-900">
                                                        <HealCoinIcon className="w-6 h-6" />
                                                        {wallet.balance?.toLocaleString() || '0'}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">Your accumulated wellness currency</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-indigo-100 via-slate-100 to-white border border-indigo-200 rounded-2xl p-4 shadow-inner flex flex-col">
                                                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 mb-2">Equivalent INR</span>
                                                    <div className="text-2xl font-black text-indigo-700">
                                                        {formatRupee(rupeesForBalance)}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">Instant cash value of your HealCoins</p>
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-white/80 border border-dashed border-purple-200 p-4 text-xs text-purple-700">
                                                You can redeem this value in the form of goodies and perks.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg space-y-5">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Gift className="w-5 h-5 text-indigo-500" />
                                            <div>
                                                <p className="font-semibold text-gray-700">Goodie Catalog</p>
                                                <p className="text-xs text-gray-400">Spend HealCoins to unlock wellness goodies delivered to you.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {goodiesLoading ? (
                                                <div className="col-span-2 rounded-2xl border border-dashed border-indigo-200 p-6 text-center text-gray-500">
                                                    Loading goodies…
                                                </div>
                                            ) : goodies.length === 0 ? (
                                                <div className="col-span-2 rounded-2xl border border-dashed border-gray-200 p-6 text-center text-gray-500">
                                                    No goodies have been created yet. Check back once the catalog is live.
                                                </div>
                                            ) : (
                                                goodies.map((goodie) => {
                                                    const canPurchase = (wallet.balance || 0) >= goodie.coins;
                                                    return (
                                                        <div
                                                            key={goodie._id}
                                                            className="flex flex-col rounded-2xl border border-gray-100 bg-indigo-50/40 p-4 shadow-sm transition hover:shadow-md"
                                                        >
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-900">{goodie.title}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">{goodie.description || "No description available"}</p>
                                                                </div>
                                                                <div className="flex flex-col items-end gap-1 text-right">
                                                                    <span className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">Cost</span>
                                                                    <div className="text-lg font-black text-indigo-700 flex items-center gap-1">
                                                                        <HealCoinIcon className="w-4 h-4" />
                                                                        {(goodie.coins || 0).toLocaleString()}
                                                                    </div>
                                                                    <span className="text-xs text-gray-500">{formatRupee((goodie.coins || 0) * HEALCOIN_TO_RUPEE_RATE)}</span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => openGoodieModal(goodie)}
                                                                disabled={!canPurchase}
                                                                className={`mt-4 w-full rounded-full px-4 py-2 text-sm font-semibold transition ${
                                                                    canPurchase
                                                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:from-indigo-500 hover:to-purple-500"
                                                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                                }`}
                                                            >
                                                                {canPurchase ? "Request Goodie" : "Need more HealCoins"}
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>

                                        {statusMsg && (
                                            <p className="text-sm text-green-600 font-semibold">{statusMsg}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {showAddressModal && selectedGoodie && typeof document !== "undefined" && createPortal(
                    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50 p-4">
                        <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl z-[1350]">
                            <button
                                onClick={closeGoodieModal}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                aria-label="Close address modal"
                            >
                                &times;
                            </button>
                            <div className="mb-4">
                                <p className="text-xs uppercase tracking-wider text-indigo-600 font-bold">Goodie Delivery</p>
                                <h3 className="text-xl font-bold text-gray-900">Shipping details for {selectedGoodie.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Provide your delivery address so we can ship the goodie. We’ll notify you once it’s on the way.
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Full Name</label>
                                    <input
                                        type="text"
                                        value={addressForm.name}
                                        onChange={(e) => handleAddressChange("name", e.target.value)}
                                        className={`w-full rounded-2xl border px-3 py-2 text-sm transition ${
                                            addressErrors.name ? "border-red-400" : "border-gray-200"
                                        }`}
                                    />
                                    {addressErrors.name && <p className="text-xs text-red-500">{addressErrors.name}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Contact Number</label>
                                    <input
                                        type="text"
                                        value={addressForm.contactNumber}
                                        onChange={(e) => handleAddressChange("contactNumber", e.target.value)}
                                        className={`w-full rounded-2xl border px-3 py-2 text-sm transition ${
                                            addressErrors.contactNumber ? "border-red-400" : "border-gray-200"
                                        }`}
                                    />
                                    {addressErrors.contactNumber && <p className="text-xs text-red-500">{addressErrors.contactNumber}</p>}
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Address Line 1</label>
                                    <input
                                        type="text"
                                        value={addressForm.addressLine1}
                                        onChange={(e) => handleAddressChange("addressLine1", e.target.value)}
                                        className={`w-full rounded-2xl border px-3 py-2 text-sm transition ${
                                            addressErrors.addressLine1 ? "border-red-400" : "border-gray-200"
                                        }`}
                                    />
                                    {addressErrors.addressLine1 && <p className="text-xs text-red-500">{addressErrors.addressLine1}</p>}
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Address Line 2 (Optional)</label>
                                    <input
                                        type="text"
                                        value={addressForm.addressLine2}
                                        onChange={(e) => handleAddressChange("addressLine2", e.target.value)}
                                        className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm transition"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">City</label>
                                    <input
                                        type="text"
                                        value={addressForm.city}
                                        onChange={(e) => handleAddressChange("city", e.target.value)}
                                        className={`w-full rounded-2xl border px-3 py-2 text-sm transition ${
                                            addressErrors.city ? "border-red-400" : "border-gray-200"
                                        }`}
                                    />
                                    {addressErrors.city && <p className="text-xs text-red-500">{addressErrors.city}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">State</label>
                                    <input
                                        type="text"
                                        value={addressForm.state}
                                        onChange={(e) => handleAddressChange("state", e.target.value)}
                                        className={`w-full rounded-2xl border px-3 py-2 text-sm transition ${
                                            addressErrors.state ? "border-red-400" : "border-gray-200"
                                        }`}
                                    />
                                    {addressErrors.state && <p className="text-xs text-red-500">{addressErrors.state}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Pincode</label>
                                    <input
                                        type="text"
                                        value={addressForm.pincode}
                                        onChange={(e) => handleAddressChange("pincode", e.target.value)}
                                        className={`w-full rounded-2xl border px-3 py-2 text-sm transition ${
                                            addressErrors.pincode ? "border-red-400" : "border-gray-200"
                                        }`}
                                    />
                                    {addressErrors.pincode && <p className="text-xs text-red-500">{addressErrors.pincode}</p>}
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold text-gray-600 uppercase">Special Instructions (Optional)</label>
                                    <textarea
                                        rows={2}
                                        value={addressForm.instructions}
                                        onChange={(e) => handleAddressChange("instructions", e.target.value)}
                                        className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm transition resize-none"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col gap-3 text-sm">
                                <p className="text-xs text-gray-500">
                                    By submitting, you acknowledge that we will debit {selectedGoodie.coins.toLocaleString()} HealCoins from your wallet.
                                </p>
                                <button
                                    onClick={submitGoodieRequest}
                                    disabled={isSubmittingGoodie}
                                    className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-2xl disabled:opacity-50"
                                >
                                    {isSubmittingGoodie ? "Sending request..." : `Confirm & Deduct ${selectedGoodie.coins.toLocaleString()} HealCoins`}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );
};

export default WalletPage;
