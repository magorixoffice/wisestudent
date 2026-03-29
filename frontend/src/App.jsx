import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherProtectedRoute from "./components/TeacherProtectedRoute";
import { useAuth } from "./hooks/useAuth";

// Global UI
import Navbar from "./components/Navbar";
// Auth Pages

// Student Pages


// Admin Pages
// Admin CSR & Program Management

// Parent Pages

// Seller Pages

// CSR Pages
import CSRLayout from "./layouts/CSRLayout";
// New CSR Pages
// CSR Status Pages

// Multi-Tenant Pages
// Multi-tenant registration pages
// 404 Page
import ErrorBoundary from "./components/ErrorBoundary";
// Toast notification provider
import { Toaster } from "react-hot-toast";

// Additional Pages


// Route-level lazy modules to keep the initial graph and chunk pressure low
const Login = React.lazy(() => import("./pages/Auth/Login"));
const Register = React.lazy(() => import("./pages/Auth/Register"));
const VerifyOTP = React.lazy(() => import("./pages/Auth/VerifyOTP"));
const ForgotPassword = React.lazy(() => import("./pages/Auth/ForgetPassword"));
const ResetPassword = React.lazy(() => import("./pages/Auth/ResetPassword"));
const StakeholderRegister = React.lazy(() => import("./pages/Auth/StakeholderRegister"));
const PendingApprovalPage = React.lazy(() => import("./pages/Auth/PendingApproval"));
const ParentRegister = React.lazy(() => import("./pages/Auth/ParentRegister"));
const SellerRegister = React.lazy(() => import("./pages/Auth/SellerRegister"));
const TeacherRegister = React.lazy(() => import("./pages/Auth/TeacherRegister"));
const AccountTypeSelection = React.lazy(() => import("./pages/Auth/AccountTypeSelection"));
const StudentAchievements = React.lazy(() => import("./pages/Student/StudentAchievements"));
const StudentDashboard = React.lazy(() => import("./pages/Student/StudentDashboard"));
const StudentActivity = React.lazy(() => import("./pages/Student/StudentActivity"));
const AssignmentAttempt = React.lazy(() => import("./pages/Student/AssignmentAttempt"));
const CategoryView = React.lazy(() => import("./pages/Student/CategoryView"));
const QuickQuiz = React.lazy(() => import("./pages/Student/QuickQuiz"));
const MoodTracker = React.lazy(() => import("./pages/Student/MoodTracker"));
const MindfulnessBreak = React.lazy(() => import("./pages/Student/MindfulnessBreak"));
const RewardsPage = React.lazy(() => import("./pages/Student/RewardsPage"));
const RedeemPage = React.lazy(() => import("./pages/Student/RedeemPage"));
const WalletPage = React.lazy(() => import("./pages/Student/WalletPage"));
const Leaderboard = React.lazy(() => import("./pages/Student/Leaderboard"));
const StudentGame = React.lazy(() => import("./pages/Student/StudentGame"));
const Notifications = React.lazy(() => import("./components/Notifications"));
const Profile = React.lazy(() => import("./components/Profile"));
const TeacherProfile = React.lazy(() => import("./pages/School/TeacherProfile"));
const Setting = React.lazy(() => import("./components/Settings"));
const BreathingExercise = React.lazy(() => import("./pages/Student/BreathingExercise"));
const FinancialLiteracy = React.lazy(() => import("./pages/Student/FinancialLiteracy"));
const PaymentPage = React.lazy(() => import("./pages/Student/PaymentPage"));
const SubscriptionCheckout = React.lazy(() => import("./pages/Student/SubscriptionCheckout"));
const PresentationPage = React.lazy(() => import("./pages/Student/PresentationPage"));
const BudgetPlanner = React.lazy(() => import("./pages/Student/BudgetPlanner"));
const InvestmentSimulator = React.lazy(() => import("./pages/Student/InvestmentSimulator"));
const SavingsGoals = React.lazy(() => import("./pages/Student/SavingsGoals"));
const FinancialQuiz = React.lazy(() => import("./pages/Student/FinancialQuiz"));
const ExpenseTracker = React.lazy(() => import("./pages/Student/ExpenseTracker"));
const CreditManagement = React.lazy(() => import("./pages/Student/CreditManagement"));
const DebtTracker = React.lazy(() => import("./pages/Student/DebtTracker"));
const BrainHealthQuiz = React.lazy(() => import("./pages/Student/BrainHealthQuiz"));
const StressManagement = React.lazy(() => import("./pages/Student/StressManagement"));
const GameCategoryPage = React.lazy(() => import("./pages/Games/GameCategoryPage"));
const DCOSGames = React.lazy(() => import("./pages/Games/DCOSGames"));
const BrainTeaserGames = React.lazy(() => import("./pages/Games/BrainTeaserGames"));
const BrainTeaserPlay = React.lazy(() => import("./pages/Games/BrainTeaserPlay"));
const AdminDashboard = React.lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminPanel = React.lazy(() => import("./pages/Admin/AdminPanel"));
const AdminAnalytics = React.lazy(() => import("./pages/Admin/AdminAnalytics"));
const AllStudents = React.lazy(() => import("./pages/Admin/AllStudents"));
const AdminRedemptions = React.lazy(() => import("./pages/Admin/AdminRedemptions"));
const FeedbackHistoryModal = React.lazy(() => import("./pages/Admin/FeedbackHistoryModal"));
const AllRedemptions = React.lazy(() => import("./pages/Admin/AllRedemptions"));
const AdminStatsPanel = React.lazy(() => import("./pages/Admin/AdminStatsPanel"));
const AdminUsersPanel = React.lazy(() => import("./pages/Admin/AdminUsersPanel"));
const AdminSettings = React.lazy(() => import("./pages/Admin/AdminSettings"));
const AdminSettingsCommunications = React.lazy(() => import("./pages/Admin/AdminSettingsCommunications"));
const AdminSchoolApprovals = React.lazy(() => import("./pages/Admin/AdminSchoolApprovals"));
const IncidentManagement = React.lazy(() => import("./pages/Admin/IncidentManagement"));
const AdminTrackingDashboard = React.lazy(() => import("./pages/Admin/AdminTrackingDashboard"));
const AdminPaymentTracker = React.lazy(() => import("./pages/Admin/AdminPaymentTracker"));
const AdminProfile = React.lazy(() => import("./pages/Admin/AdminProfile"));
const AdminReports = React.lazy(() => import("./pages/Admin/AdminReports"));
const BehaviorAnalytics = React.lazy(() => import("./pages/Admin/BehaviorAnalytics"));
const SmartInsights = React.lazy(() => import("./pages/Admin/SmartInsights"));
const FinancialConsole = React.lazy(() => import("./pages/Admin/FinancialConsole"));
const SupportDesk = React.lazy(() => import("./pages/Admin/SupportDesk"));
const LifecycleManagement = React.lazy(() => import("./pages/Admin/LifecycleManagement"));
const ContentGovernance = React.lazy(() => import("./pages/Admin/ContentGovernance"));
const AuditTimeline = React.lazy(() => import("./pages/Admin/AuditTimeline"));
const ConfigurationControlCenter = React.lazy(() => import("./pages/Admin/ConfigurationControlCenter"));
const CommunicationSuite = React.lazy(() => import("./pages/Admin/CommunicationSuite"));
const AdminPlatform = React.lazy(() => import("./pages/Admin/AdminPlatform"));
const GoodieOrders = React.lazy(() => import("./pages/Admin/GoodieOrders"));
const AdminCSRPartners = React.lazy(() => import("./pages/Admin/AdminCSRPartners"));
const AdminCSRNotifications = React.lazy(() => import("./pages/Admin/AdminCSRNotifications"));
const AdminPrograms = React.lazy(() => import("./pages/Admin/AdminPrograms"));
const AdminProgramCreate = React.lazy(() => import("./pages/Admin/AdminProgramCreate"));
const AdminProgramEdit = React.lazy(() => import("./pages/Admin/AdminProgramEdit"));
const AdminProgramDetail = React.lazy(() => import("./pages/Admin/AdminProgramDetail"));
const AdminProgramSchools = React.lazy(() => import("./pages/Admin/AdminProgramSchools"));
const AdminProgramCheckpoints = React.lazy(() => import("./pages/Admin/AdminProgramCheckpoints"));
const AdminProgramMetrics = React.lazy(() => import("./pages/Admin/AdminProgramMetrics"));
const AdminProgramReports = React.lazy(() => import("./pages/Admin/AdminProgramReports"));
const ParentDashboard = React.lazy(() => import("./pages/Parent/ParentDashboard"));
const ParentOverview = React.lazy(() => import("./pages/Parent/ParentOverview"));
const ParentChildren = React.lazy(() => import("./pages/Parent/ParentChildren"));
const ParentChildAnalytics = React.lazy(() => import("./pages/Parent/ParentChildAnalytics"));
const ChildProgress = React.lazy(() => import("./pages/Parent/ChildProgress"));
const ChildMoodWellbeing = React.lazy(() => import("./pages/Parent/ChildMoodWellbeing"));
const ChildWalletRewards = React.lazy(() => import("./pages/Parent/ChildWalletRewards"));
const ParentSettings = React.lazy(() => import("./pages/Parent/ParentSettings"));
const ParentUpgrade = React.lazy(() => import("./pages/Parent/ParentUpgrade"));
const ParentProfile = React.lazy(() => import("./pages/Parent/ParentProfile"));
const ParentGameCategoryPage = React.lazy(() => import("./pages/Parent/Games/ParentGameCategoryPage"));
const UniversalParentGameRenderer = React.lazy(() => import("./pages/Parent/Games/UniversalParentGameRenderer"));
const ParentGamesHub = React.lazy(() => import("./pages/Parent/Games/ParentGamesHub"));
const TeacherGamesHub = React.lazy(() => import("./pages/Teacher/Games/TeacherGamesHub"));
const TeacherGameCategoryPage = React.lazy(() => import("./pages/Teacher/Games/TeacherGameCategoryPage"));
const UniversalTeacherGameRenderer = React.lazy(() => import("./pages/Teacher/Games/UniversalTeacherGameRenderer"));
const SellerDashboard = React.lazy(() => import("./pages/Seller/SellerDashboard"));
const CSRProfile = React.lazy(() => import("./pages/CSR/CSRProfile"));
const CSRSettings = React.lazy(() => import("./pages/CSR/CSRSettings"));
const CSRNotifications = React.lazy(() => import("./pages/CSR/CSRNotifications"));
const CSRProgramOverview = React.lazy(() => import("./pages/CSR/CSRProgramOverview"));
const CSRStudentReach = React.lazy(() => import("./pages/CSR/CSRStudentReach"));
const CSREngagement = React.lazy(() => import("./pages/CSR/CSREngagement"));
const CSRReadinessExposure = React.lazy(() => import("./pages/CSR/CSRReadinessExposure"));
const CSRSchoolCoverageNew = React.lazy(() => import("./pages/CSR/CSRSchoolCoverageNew"));
const CSRRecognition = React.lazy(() => import("./pages/CSR/CSRRecognition"));
const CSRImpactReports = React.lazy(() => import("./pages/CSR/CSRImpactReports"));
const CSRPendingApproval = React.lazy(() => import("./pages/CSR/CSRPendingApproval"));
const CSRRejected = React.lazy(() => import("./pages/CSR/CSRRejected"));
const CSRNoProgram = React.lazy(() => import("./pages/CSR/CSRNoProgram"));
const CompanySignup = React.lazy(() => import("./pages/MultiTenant/CompanySignup"));
const CreateOrganization = React.lazy(() => import("./pages/MultiTenant/CreateOrganization"));
const SchoolAdminDashboard = React.lazy(() => import("./pages/School/SchoolAdminDashboard"));
const AnnouncementManagement = React.lazy(() => import("./pages/School/AnnouncementManagement"));
const Announcements = React.lazy(() => import("./pages/School/Announcements"));
const SchoolAdminAnalytics = React.lazy(() => import("./pages/School/SchoolAdminAnalytics"));
const SchoolAdminStudents = React.lazy(() => import("./pages/School/SchoolAdminStudents"));
const SchoolAdminTopPerformers = React.lazy(() => import("./pages/School/SchoolAdminTopPerformers"));
const SchoolAdminTeachers = React.lazy(() => import("./pages/School/SchoolAdminTeachers"));
const SchoolAdminClasses = React.lazy(() => import("./pages/School/SchoolAdminClasses"));
const SchoolAdminStaff = React.lazy(() => import("./pages/School/SchoolAdminStaff"));
const SchoolAdminApprovals = React.lazy(() => import("./pages/School/SchoolAdminApprovals"));
const SchoolAdminTemplates = React.lazy(() => import("./pages/School/SchoolAdminTemplates"));
const SchoolAdminNEPTracking = React.lazy(() => import("./pages/School/SchoolAdminNEPTracking"));
const SchoolAdminCompliance = React.lazy(() => import("./pages/School/SchoolAdminCompliance"));
const SchoolAdminBilling = React.lazy(() => import("./pages/School/SchoolAdminBilling"));
const SchoolAdminPaymentTracker = React.lazy(() => import("./pages/School/SchoolAdminPaymentTracker"));
const AdminSchools = React.lazy(() => import("./pages/Admin/AdminSchools"));
const AdminIndividuals = React.lazy(() => import("./pages/Admin/AdminIndividuals"));
const AdminSchoolDetail = React.lazy(() => import("./pages/Admin/AdminSchoolDetail"));
const SchoolAdminEmergency = React.lazy(() => import("./pages/School/SchoolAdminEmergency"));
const SchoolAdminEvents = React.lazy(() => import("./pages/School/SchoolAdminEvents"));
const SchoolAdminSettings = React.lazy(() => import("./pages/School/SchoolAdminSettings"));
const SchoolAdminProfile = React.lazy(() => import("./pages/School/SchoolAdminProfile"));
const SchoolAdminSettingsPersonal = React.lazy(() => import("./pages/School/SchoolAdminSettingsPersonal"));
const SchoolTeacherDashboard = React.lazy(() => import("./pages/School/SchoolTeacherDashboard"));
const SchoolStudentDashboard = React.lazy(() => import("./pages/School/SchoolStudentDashboard"));
const SchoolParentDashboard = React.lazy(() => import("./pages/School/SchoolParentDashboard"));
const TeacherOverview = React.lazy(() => import("./pages/School/TeacherOverview"));
const SchoolTestimonialSubmit = React.lazy(() => import("./pages/School/SchoolTestimonialSubmit"));
const SchoolSponsorship = React.lazy(() => import("./pages/School/SchoolSponsorship"));
const SchoolSponsorshipGallery = React.lazy(() => import("./pages/School/SchoolSponsorshipGallery"));
const SchoolSponsorshipThankYou = React.lazy(() => import("./pages/School/SchoolSponsorshipThankYou"));
const TeacherStudents = React.lazy(() => import("./pages/School/TeacherStudents"));
const TeacherAnalytics = React.lazy(() => import("./pages/School/TeacherAnalytics"));
const TeacherTasks = React.lazy(() => import("./pages/School/TeacherTasks"));
const TeacherChatContacts = React.lazy(() => import("./pages/School/TeacherChatContacts"));
const TeacherSettings = React.lazy(() => import("./pages/School/TeacherSettings"));
const TeacherStudentProgress = React.lazy(() => import("./pages/School/TeacherStudentProgress"));
const TeacherStudentWalletRewards = React.lazy(() => import("./pages/School/TeacherStudentWalletRewards"));
const TeacherParentChat = React.lazy(() => import("./pages/School/TeacherParentChat"));
const TeacherStudentChat = React.lazy(() => import("./pages/School/TeacherStudentChat"));
const SchoolStudentChat = React.lazy(() => import("./pages/School/SchoolStudentChat"));
const ParentChat = React.lazy(() => import("./pages/Parent/ParentChat"));
const AssignmentTracking = React.lazy(() => import("./pages/School/AssignmentTracking"));
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const PlatformDetails = React.lazy(() => import("./pages/PlatformDetails"));
const IndividualAccountSelection = React.lazy(() => import("./pages/IndividualAccountSelection"));
const InstitutionTypeSelection = React.lazy(() => import("./pages/MultiTenant/InstitutionTypeSelection"));
const SchoolRegistration = React.lazy(() => import("./pages/MultiTenant/SchoolRegistration"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const About = React.lazy(() => import("./pages/About"));
const Blog = React.lazy(() => import("./pages/Blog"));
const Careers = React.lazy(() => import("./pages/Careers"));
const CareerApply = React.lazy(() => import("./pages/CareerApply"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Terms = React.lazy(() => import("./pages/Terms"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const Cookies = React.lazy(() => import("./pages/Cookies"));
const UniversalGameRenderer = React.lazy(() => import("./components/UniversalGameRenderer"));

const App = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Update document title based on current route
  useEffect(() => {
    const getPageTitle = (pathname) => {
      // Auth pages
      if (pathname === "/login") return "Login";
      if (pathname === "/register") return "Register";
      if (pathname === "/forgot-password") return "Forgot Password";
      if (pathname === "/reset-password") return "Reset Password";
      if (pathname === "/verify-otp") return "Verify OTP";
      if (pathname === "/pending-approval") return "Pending Approval";
      if (pathname === "/choose-account-type") return "Choose Account Type";
      if (pathname === "/register-parent") return "Register Parent";
      if (pathname === "/register-seller") return "Register Seller";
      if (pathname === "/register-teacher") return "Register Teacher";
      if (pathname === "/register-stakeholder" || pathname === "/register-csr") return "CSR Registration";
      
      // Landing and public pages
      if (pathname === "/") return "Wise Student";
      if (pathname === "/about") return "About Us";
      if (pathname === "/blog") return "Blog";
      if (pathname === "/careers") return "Careers";
      if (pathname.startsWith("/careers/apply")) return "Apply for Job";
      if (pathname === "/contact") return "Contact Us";
      if (pathname === "/terms") return "Terms of Service";
      if (pathname === "/privacy") return "Privacy Policy";
      if (pathname === "/cookies") return "Cookie Policy";
      
      // Account selection
      if (pathname === "/individual-account") return "Individual Account";
      if (pathname === "/institution-type") return "Institution Type";
      if (pathname === "/school-registration") return "School Registration";
      if (pathname === "/company-signup") return "Company Signup";
      if (pathname === "/create-organization") return "Create Organization";
      
      // Student routes
      if (pathname === "/student/dashboard") return "Student Dashboard";
      if (pathname === "/student/activity") return "Student Activity";
      if (pathname.startsWith("/student/assignment/")) return "Assignment";
      if (pathname === "/student/announcements") return "Announcements";
      if (pathname === "/student/dashboard/quick-quiz") return "Quick Quiz";
      if (pathname.startsWith("/student/dashboard/")) return "Category";
      if (pathname === "/student/mindfull-break") return "Mindfulness Break";
      if (pathname === "/student/mood-tracker") return "Mood Tracker";
      if (pathname === "/student/rewards") return "Rewards";
      if (pathname === "/student/redeem") return "Redeem";
      if (pathname === "/student/wallet") return "Wallet";
      if (pathname === "/student/leaderboard") return "Leaderboard";
      if (pathname === "/student/game") return "Games";
      if (pathname === "/student/notifications") return "Notifications";
      if (pathname === "/student/profile") return "Profile";
      if (pathname === "/student/settings") return "Settings";
      if (pathname === "/student/payment") return "Payment";
      if (pathname.startsWith("/student/presentation")) return "Presentation";
      if (pathname === "/student/breathing") return "Breathing Exercise";
      if (pathname === "/learn/brain-health-quiz") return "Brain Health Quiz";
      if (pathname === "/tools/stress-management") return "Stress Management";
      if (pathname === "/tools/cognitive-training") return "Cognitive Training";
      if (pathname === "/student/ai-for-all/ai-basics") return "AI Basics & Fundamentals";
      if (pathname === "/student/ai-for-all/machine-learning") return "Machine Learning 101";
      if (pathname === "/student/ai-for-all/ai-applications") return "AI Applications";
      if (pathname === "/student/ai-for-all/data-ethics") return "Data Ethics & Privacy";
      if (pathname === "/student/ai-for-all/automation") return "Automation & Robotics";
      if (pathname === "/student/health-female/menstrual-health") return "Menstrual Health";
      if (pathname === "/student/health-female/nutrition") return "Nutrition & Diet";
      if (pathname === "/student/health-female/fitness") return "Fitness & Exercise";
      if (pathname === "/student/health-female/body-positivity") return "Body Positivity";
      if (pathname === "/student/health-female/reproductive-health") return "Reproductive Health";
      
      // Student financial literacy routes
      if (pathname === "/learn/financial-literacy") return "Financial Literacy";
      if (pathname === "/student/finance/budget-planner" || pathname === "/tools/budget-planner") return "Budget Planner";
      if (pathname === "/student/finance/investment-simulator" || pathname === "/games/investment-simulator") return "Investment Simulator";
      if (pathname === "/student/finance/savings-goals" || pathname === "/tools/savings-goals") return "Savings Goals";
      if (pathname === "/student/finance/financial-quiz" || pathname === "/learn/financial-quiz") return "Financial Quiz";
      if (pathname === "/student/finance/expense-tracker" || pathname === "/tools/expense-tracker") return "Expense Tracker";
      if (pathname === "/student/finance/credit-management" || pathname === "/tools/credit-management") return "Credit Management";
      if (pathname === "/student/finance/debt-tracker" || pathname === "/tools/debt-tracker") return "Debt Tracker";
      
      // Student game routes
      if (pathname.startsWith("/student/") && pathname.includes("/games/")) return "Games";
      if (pathname.startsWith("/games/")) return "Games";
      
      // School Admin routes
      if (pathname === "/school/admin/dashboard") return "School Admin Dashboard";
      if (pathname === "/school/admin/analytics") return "School Analytics";
      if (pathname === "/school/admin/students") return "Students";
      if (pathname === "/school/admin/teachers") return "Teachers";
      if (pathname === "/school/admin/classes") return "Classes";
      if (pathname === "/school/admin/staff") return "Staff";
      if (pathname === "/school/admin/announcements") return "Announcements";
      if (pathname === "/school/admin/approvals") return "Approvals";
      if (pathname === "/school/admin/templates") return "Templates";
      if (pathname === "/school/admin/nep-tracking") return "NEP Tracking";
      if (pathname === "/school/admin/compliance") return "Compliance";
      if (pathname === "/school/admin/billing") return "Billing";
      if (pathname === "/school/admin/emergency") return "Emergency";
      if (pathname === "/school/admin/events") return "Events";
      if (pathname === "/school/admin/settings") return "School Settings";
      if (pathname === "/school/admin/payment-tracker") return "Payment Tracker";
      if (pathname === "/school_admin/profile") return "School Admin Profile";
      if (pathname === "/school_admin/settings") return "School Admin Settings";
      
      // School Teacher routes
      if (pathname === "/school-teacher/overview") return "Teacher Overview";
      if (pathname === "/school-teacher/dashboard") return "Teacher Dashboard";
      if (pathname === "/school-teacher/students") return "My Students";
      if (pathname === "/school-teacher/analytics") return "Teacher Analytics";
      if (pathname === "/school-teacher/chat-contacts") return "Chat Contacts";
      if (pathname === "/school-teacher/announcements") return "Announcements";
      if (pathname === "/school-teacher/tasks") return "Tasks";
      if (pathname === "/school-teacher/tracking") return "Assignment Tracking";
      if (pathname === "/school-teacher/settings") return "Teacher Settings";
      if (pathname === "/school_teacher/settings") return "Teacher Settings";
      if (pathname.startsWith("/school-teacher/student/") && pathname.includes("/wallet")) return "Student Wallet";
      if (pathname.startsWith("/school-teacher/student/")) return "Student Progress";
      if (pathname.startsWith("/school-teacher/student-chat/")) return "Student Chat";
      if (pathname.startsWith("/school-teacher/student/") && pathname.includes("/parent-chat")) return "Parent Chat";
      if (pathname === "/school-teacher/profile") return "Teacher Profile";
      if (pathname === "/school_teacher/profile") return "Teacher Profile";
      
      // School Student routes
      if (pathname === "/school-student/dashboard") return "Student Dashboard";
      if (pathname === "/school-student/announcements") return "Announcements";
      if (pathname === "/school-student/chat") return "Chat";
      
      // School Parent routes
      if (pathname === "/school-parent/dashboard") return "Parent Dashboard";
      if (pathname === "/school-parent/announcements") return "Announcements";
      if (pathname.startsWith("/school-parent/student/") && pathname.includes("/chat")) return "Chat";
      
      // Admin routes
      if (pathname === "/admin/panel") return "Admin Panel";
      if (pathname === "/admin/dashboard") return "Admin Dashboard";
      if (pathname === "/admin/analytics") return "Admin Analytics";
      if (pathname === "/admin/students") return "All Students";
      if (pathname === "/admin/redemptions") return "Redemptions";
      if (pathname === "/admin/feedback") return "Feedback";
      if (pathname === "/admin/all-redemptions") return "All Redemptions";
      if (pathname === "/admin/stats") return "Statistics";
      if (pathname === "/admin/users") return "Users";
      if (pathname === "/admin/profile") return "Admin Profile";
      if (pathname === "/admin/settings") return "Admin Settings";
      if (pathname === "/admin/settings/communications") return "Communication Settings";
      if (pathname === "/admin/notifications") return "Notifications";
      if (pathname === "/admin/approvals") return "Approvals";
      if (pathname === "/admin/schools") return "Schools";
      if (pathname === "/admin/individuals") return "Individuals";
      if (pathname.startsWith("/admin/schools/")) return "School Details";
      if (pathname === "/admin/incidents") return "Incident Management";
      if (pathname === "/admin/tracking") return "Tracking Dashboard";
      if (pathname === "/admin/payment-tracker") return "Payment Tracker";
      if (pathname === "/admin/reports") return "Reports";
      if (pathname === "/admin/behavior-analytics") return "Behavior Analytics";
      if (pathname === "/admin/smart-insights") return "Smart Insights";
      if (pathname === "/admin/financial-console") return "Financial Console";
      if (pathname === "/admin/support-desk") return "Support Desk";
      if (pathname === "/admin/lifecycle") return "Lifecycle Management";
      if (pathname === "/admin/content-governance") return "Content Governance";
      if (pathname === "/admin/audit-timeline") return "Audit Timeline";
      if (pathname === "/admin/configuration") return "Configuration";
      if (pathname === "/admin/communication") return "Communication Suite";
      if (pathname === "/admin/platform") return "Admin Platform";
      // Admin CSR & Program Management routes
      if (pathname === "/admin/csr/partners") return "CSR Partners";
      if (pathname.startsWith("/admin/csr/partners/")) return "CSR Partner Details";
      if (pathname === "/admin/csr/notifications") return "CSR Notifications";
      if (pathname === "/admin/programs") return "CSR Programs";
      if (pathname === "/admin/programs/create") return "Create Program";
      if (pathname.startsWith("/admin/programs/") && pathname.endsWith("/edit")) return "Edit Program";
      if (pathname.startsWith("/admin/programs/") && pathname.endsWith("/schools")) return "Program Schools";
      if (pathname.startsWith("/admin/programs/") && pathname.endsWith("/checkpoints")) return "Program Checkpoints";
      if (pathname.startsWith("/admin/programs/") && pathname.endsWith("/metrics")) return "Program Metrics";
      if (pathname.startsWith("/admin/programs/") && pathname.endsWith("/reports")) return "Program Reports";
      if (pathname.startsWith("/admin/programs/")) return "Program Details";
      
      // Parent routes
      if (pathname === "/parent/overview") return "Parent Overview";
      if (pathname === "/parent/dashboard") return "Parent Dashboard";
      if (pathname === "/parent/announcements") return "Announcements";
      if (pathname === "/parent/children") return "My Children";
      if (pathname === "/parent/settings") return "Parent Settings";
      if (pathname === "/parent/upgrade") return "Upgrade";
      if (pathname.startsWith("/parent/child/")) {
        if (pathname.includes("/analytics")) return "Child Analytics";
        if (pathname.includes("/progress")) return "Child Progress";
        if (pathname.includes("/wellbeing")) return "Child Wellbeing";
        if (pathname.includes("/wallet")) return "Child Wallet";
        if (pathname.includes("/chat")) return "Chat";
        return "Child Details";
      }
      if (pathname === "/parent/profile") return "Parent Profile";
      if (pathname === "/parent/notifications") return "Notifications";
      if (pathname === "/parent/parent-progress" || pathname === "/parent/progress") return "Progress";
      
      // Seller routes
      if (pathname === "/seller/dashboard") return "Seller Dashboard";
      
      // CSR routes
      if (pathname === "/csr" || pathname === "/csr/overview") return "Program Overview";
      if (pathname === "/csr/student-reach") return "Student Reach";
      if (pathname === "/csr/engagement") return "Engagement & Participation";
      if (pathname === "/csr/readiness-exposure") return "Readiness Exposure";
      if (pathname === "/csr/schools") return "School Coverage";
      if (pathname === "/csr/recognition") return "Recognition";
      if (pathname === "/csr/reports") return "Impact Reports";
      if (pathname === "/csr/notifications") return "Notifications";
      if (pathname === "/csr/profile") return "Profile";
      if (pathname === "/csr/settings") return "Settings";
      if (pathname === "/csr/pending-approval") return "Pending Approval";
      if (pathname === "/csr/rejected") return "Application Rejected";
      if (pathname === "/csr/no-program") return "No Program Assigned";
      // Legacy routes (redirected)
      if (pathname === "/csr/dashboard") return "Program Overview";
      
      // Chat routes
      if (pathname.includes("/student-chat/") || pathname.includes("/parent-chat")) return "Chat";
      
      // Default fallback - format pathname nicely
      const pathParts = pathname.split("/").filter(Boolean);
      if (pathParts.length === 0) return "Wise Student";
      
      // Capitalize and format the last path segment
      const lastPart = pathParts[pathParts.length - 1];
      const formatted = lastPart
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      return formatted || "Wise Student";
    };

    document.title = getPageTitle(location.pathname);
  }, [location.pathname]);

  const isAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ].includes(location.pathname);

  const RootRedirect = () => {
    if (!user) return <Navigate to="/login" replace />;

    // Legacy roles
    if (user.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "parent")
      return <Navigate to="/parent/overview" replace />;
    if (user.role === "seller")
      return <Navigate to="/seller/dashboard" replace />;
    if (user.role === "csr") {
      // Check approval status for CSR users
      if (user.approvalStatus === "pending") {
        return <Navigate to="/csr/pending-approval" replace />;
      } else if (user.approvalStatus === "rejected") {
        return <Navigate to="/csr/rejected" replace />;
      } else {
        return <Navigate to="/csr/overview" replace />;
      }
    }

    // School roles
    if (user.role === "school_admin")
      return <Navigate to="/school/admin/dashboard" replace />;
    if (user.role === "school_teacher")
      return <Navigate to="/school-teacher/overview" replace />;
    if (user.role === "school_student")
      return <Navigate to="/student/dashboard" replace />;
    if (user.role === "school_parent")
      return <Navigate to="/school-parent/dashboard" replace />;

    // Default fallback
    return <Navigate to="/student/dashboard" replace />;
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4" />
        <div className="text-gray-600">Loading your experience...</div>
      </div>
    );
  }

  // Hide navbar on full-screen game routes and standalone pages with back buttons
  const isFullScreenGame =
    location.pathname.startsWith("/student/games/") ||
    location.pathname.startsWith("/student/finance/kids/") ||
    location.pathname.startsWith("/student/finance/teen/") ||
    location.pathname.startsWith("/student/finance/young-adult/") ||
    location.pathname.startsWith("/student/finance/adults/") ||
    location.pathname.startsWith("/student/finance/insurance-pension/") ||
    location.pathname.startsWith("/student/finance/business-livelihood-finance/") ||
    location.pathname.startsWith("/student/brain/kids/") ||
    location.pathname.startsWith("/student/brain/teen/") ||
      location.pathname.startsWith("/student/brain-health/young-adult/") ||
      location.pathname.startsWith("/student/brain-health/adults/") ||
    location.pathname.startsWith("/student/uvls/kids/") ||
    location.pathname.startsWith("/student/uvls/teen/") ||
    location.pathname.startsWith("/student/health-male/kids/") ||
    location.pathname.startsWith("/student/health-male/teen") ||
    location.pathname.startsWith("/student/health-female/kids/") ||
    location.pathname.startsWith("/student/health-female/teen") ||
    location.pathname.startsWith("/student/dcos/kids/") ||
    location.pathname.startsWith("/student/dcos/teen/") ||
    location.pathname.startsWith("/student/dcos/teens/") ||
    location.pathname.startsWith("/student/moral-values/kids/") ||
    location.pathname.startsWith("/student/moral-values/teen/") ||
    location.pathname.startsWith("/student/ai-for-all/kids/") ||
    location.pathname.startsWith("/student/ai-for-all/teen/") ||
    location.pathname.startsWith("/student/ehe/kids/") ||
    location.pathname.startsWith("/student/ehe/teen/") ||
    location.pathname.startsWith("/student/ehe/teens/") ||
    location.pathname.startsWith("/student/ehe/young-adult/") ||
    location.pathname.startsWith("/student/ehe/adult/") ||
    location.pathname.startsWith("/student/civic-responsibility/kids/") ||
    location.pathname.startsWith("/student/civic-responsibility/teen/") ||
    location.pathname.startsWith("/student/civic-responsibility/teens/") ||
    location.pathname.startsWith("/student/sustainability/kids/") ||
    location.pathname.startsWith("/student/sustainability/teens/") ||
    location.pathname.startsWith("/games/") ||
    location.pathname.startsWith("/tools/") ||
    location.pathname.startsWith("/learn/") ||
    location.pathname.startsWith("/parent/games/") || // Hide navbar on parent game pages
    location.pathname === "/student/breathing";

  // Hide navbar on chat pages
  const isChatPage = location.pathname.includes("/chat");

  // Hide navbar on public pages
  const isPublicPage =
    [
    "/about",
    "/careers",
    "/blog",
    "/contact",
    "/terms",
    "/privacy",
    "/cookies",
    ].includes(location.pathname) || location.pathname.startsWith("/careers/apply");

  // Hide navbar on presentation pages (when editing or presenting a specific presentation)
  // Show navbar on /student/presentation (list page), hide on /student/presentation/:id or /student/presentation/share/:shareCode
  const isPresentationPage = location.pathname.startsWith("/student/presentation") && 
    location.pathname !== "/student/presentation" &&
    (location.pathname.match(/\/student\/presentation\/[^/]+$/) || location.pathname.includes("/student/presentation/share/"));

  // Hide navbar on CSR pages (they use sidebar instead)
  const isCSRPage = location.pathname.startsWith("/csr");
  const isPlatformDetailsPage = location.pathname === "/platform-details";

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthPage &&
        !isFullScreenGame &&
        !isChatPage &&
        !isPublicPage &&
        !isPresentationPage &&
        !isCSRPage &&
        !isPlatformDetailsPage &&
        location.pathname !== "/" &&
        location.pathname !== "/school-registration" &&
        location.pathname !== "/institution-type" &&
        location.pathname !== "/individual-account" &&
        location.pathname !== "/choose-account-type" &&
        location.pathname !== "/register-parent" &&
        location.pathname !== "/register-seller" &&
        location.pathname !== "/register-teacher" &&
        location.pathname !== "/register-stakeholder" &&
        location.pathname !== "/register-csr" &&
        location.pathname !== "/pending-approval" &&
        !location.pathname.includes("/student-chat/") &&
        !location.pathname.includes("/parent-chat") && <Navbar />}
      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}><Routes>
          <Route path="/" element={user ? <RootRedirect /> : <LandingPage />} />
          <Route path="/platform-details" element={<PlatformDetails />} />
          <Route
            path="/individual-account"
            element={<IndividualAccountSelection />}
          />

          {/* Auth Routes */}
          {/* If authenticated, redirect away from login to role dashboard */}
          <Route path="/login" element={user ? <RootRedirect /> : <Login />} />
          <Route path="/register" element={<Register />} />
          {/* Google login route removed */}
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/register-csr"
            element={<StakeholderRegister />}
          />
          {/* Legacy route - also renders CSR registration */}
          <Route
            path="/register-stakeholder"
            element={<StakeholderRegister />}
          />
          <Route path="/register-parent" element={<ParentRegister />} />
          <Route path="/register-seller" element={<SellerRegister />} />
          <Route path="/register-teacher" element={<TeacherRegister />} />
          <Route
            path="/choose-account-type"
            element={<AccountTypeSelection />}
          />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />

          {/* Multi-Tenant Routes */}
          <Route path="/company-signup" element={<CompanySignup />} />
          <Route path="/create-organization" element={<CreateOrganization />} />

          {/* Institution Registration Routes */}
          <Route
            path="/institution-type"
            element={<InstitutionTypeSelection />}
          />
          <Route path="/school-registration" element={<SchoolRegistration />} />

          {/* School Admin Routes */}
          <Route
            path="/school/admin/dashboard"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/analytics"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminAnalytics />
              </ProtectedRoute>
            }
          />
          {/* Student progress route - must be before /students to match correctly */}
          <Route
            path="/school/admin/student/:studentId/progress"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <TeacherStudentProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/students"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/top-performers"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminTopPerformers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/teachers"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminTeachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/classes"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/staff"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/announcements"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <AnnouncementManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/testimonial/submit"
            element={
              <ProtectedRoute roles={["school_admin","school_teacher","school_parent","school_student"]}>
                <SchoolTestimonialSubmit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/approvals"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/templates"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminTemplates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/nep-tracking"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminNEPTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/compliance"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminCompliance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/billing"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminBilling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/emergency"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminEmergency />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/events"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/settings"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/admin/payment-tracker"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminPaymentTracker />
              </ProtectedRoute>
            }
          />

          {/* School Admin Profile & Settings Routes */}
          <Route
            path="/school_admin/profile"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school_admin/settings"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolAdminSettingsPersonal />
              </ProtectedRoute>
            }
          />

          {/* School Teacher Routes */}
          <Route
            path="/school-teacher/overview"
            element={
              <TeacherProtectedRoute>
                <TeacherOverview />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/dashboard"
            element={
              <TeacherProtectedRoute>
                <SchoolTeacherDashboard />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/students"
            element={
              <TeacherProtectedRoute>
                <TeacherStudents />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/analytics"
            element={
              <TeacherProtectedRoute>
                <TeacherAnalytics />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/chat-contacts"
            element={
              <TeacherProtectedRoute>
                <TeacherChatContacts />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/announcements"
            element={
              <TeacherProtectedRoute>
                <Announcements />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/tasks"
            element={
              <TeacherProtectedRoute>
                <TeacherTasks />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/tracking"
            element={
              <TeacherProtectedRoute>
                <AssignmentTracking />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/settings"
            element={
              <TeacherProtectedRoute>
                <TeacherSettings />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school_teacher/settings"
            element={
              <TeacherProtectedRoute>
                <TeacherSettings />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/student/:studentId/progress"
            element={
              <TeacherProtectedRoute>
                <TeacherStudentProgress />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/student/:studentId/wallet"
            element={
              <TeacherProtectedRoute>
                <TeacherStudentWalletRewards />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/student-chat/:studentId"
            element={
              <TeacherProtectedRoute>
                <TeacherStudentChat />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/student/:studentId/parent-chat"
            element={
              <TeacherProtectedRoute>
                <TeacherParentChat />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/profile"
            element={
              <TeacherProtectedRoute>
                <TeacherProfile />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school_teacher/profile"
            element={
              <TeacherProtectedRoute>
                <TeacherProfile />
              </TeacherProtectedRoute>
            }
          />

          <Route
            path="/school-student/dashboard"
            element={
              <ProtectedRoute roles={["school_student"]}>
                <SchoolStudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-student/announcements"
            element={
              <ProtectedRoute roles={["school_student"]}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-student/chat"
            element={
              <ProtectedRoute roles={["school_student"]}>
                <SchoolStudentChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-parent/dashboard"
            element={
              <ProtectedRoute roles={["school_parent"]}>
                <SchoolParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-parent/announcements"
            element={
              <ProtectedRoute roles={["school_parent"]}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-parent/student/:studentId/chat"
            element={
              <ProtectedRoute roles={["school_parent"]}>
                <ParentChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/school/sponsorship"
            element={
              <ProtectedRoute roles={["school_admin", "school_teacher", "school_student", "school_parent"]}>
                <SchoolSponsorship />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/sponsorship/gallery"
            element={
              <ProtectedRoute roles={["school_admin", "school_teacher", "school_student", "school_parent"]}>
                <SchoolSponsorshipGallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school/sponsorship/thank-you"
            element={
              <ProtectedRoute roles={["school_admin", "school_teacher", "school_student", "school_parent"]}>
                <SchoolSponsorshipThankYou />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/achievements"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StudentAchievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/activity"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StudentActivity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/assignment/:assignmentId/attempt"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <AssignmentAttempt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/announcements"
            element={
              <ProtectedRoute roles={["student"]}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard/quick-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <QuickQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard/:categorySlug"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CategoryView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/mindfull-break"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <MindfulnessBreak />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/mood-tracker"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <MoodTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/rewards"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RewardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/redeem"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <RedeemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/wallet"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <WalletPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/leaderboard"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/game"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StudentGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute roles={["student"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/settings"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <Setting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/payment"
            element={
              <ProtectedRoute roles={["student"]}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/presentation/:id?"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PresentationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/presentation/share/:shareCode"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <PresentationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/breathing"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <MindfulnessBreak />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/financial-literacy"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FinancialLiteracy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/brain-health-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BrainHealthQuiz />
              </ProtectedRoute>
            }
          />
          {/* Financial Literacy Routes - New structure */}
          <Route
            path="/student/finance/budget-planner"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BudgetPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/investment-simulator"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <InvestmentSimulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/savings-goals"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SavingsGoals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/financial-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FinancialQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/expense-tracker"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ExpenseTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/credit-management"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CreditManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/finance/debt-tracker"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebtTracker />
              </ProtectedRoute>
            }
          />

          {/* Legacy routes for backward compatibility */}
          <Route
            path="/tools/budget-planner"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <BudgetPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/investment-simulator"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <InvestmentSimulator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/savings-goals"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <SavingsGoals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/financial-quiz"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <FinancialQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/expense-tracker"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <ExpenseTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/credit-management"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <CreditManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/debt-tracker"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <DebtTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/stress-management"
            element={
              <ProtectedRoute roles={["student", "school_student"]}>
                <StressManagement />
              </ProtectedRoute>
            }
          />


        {/* Universal Game Routes - Can render any game within single component*/}
        <Route path="/student/:category/:age/:game" element={<ProtectedRoute roles={['student', 'school_student']}><UniversalGameRenderer /></ProtectedRoute>} />

        {/* Legacy Game Category Pages - Keep for backward compatibility */}
        <Route path="/games/dcos" element={<ProtectedRoute roles={['student', 'school_student']}><DCOSGames /></ProtectedRoute>} />
        <Route path="/games/brain-teaser" element={<ProtectedRoute roles={['student', 'school_student']}><BrainTeaserGames /></ProtectedRoute>} />
        <Route path="/games/brain-teaser/:gameId" element={<ProtectedRoute roles={['student', 'school_student']}><BrainTeaserPlay /></ProtectedRoute>} />
        <Route path="/games/:category/:ageGroup" element={<ProtectedRoute roles={['student', 'school_student']}><GameCategoryPage /></ProtectedRoute>} />


          {/* Admin Routes */}
          <Route
            path="/admin/panel"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AllStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/redemptions"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminRedemptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/goodie-orders"
            element={
              <ProtectedRoute roles={["admin"]}>
                <GoodieOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute roles={["admin"]}>
                <FeedbackHistoryModal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/all-redemptions"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AllRedemptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminStatsPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUsersPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings/communications"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSettingsCommunications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSchoolApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schools"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSchools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/individuals"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminIndividuals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/schools/:schoolId"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminSchoolDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/incidents"
            element={
              <ProtectedRoute roles={["admin"]}>
                <IncidentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tracking"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminTrackingDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payment-tracker"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPaymentTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/behavior-analytics"
            element={
              <ProtectedRoute roles={["admin"]}>
                <BehaviorAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/smart-insights"
            element={
              <ProtectedRoute roles={["admin"]}>
                <SmartInsights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/financial-console"
            element={
              <ProtectedRoute roles={["admin"]}>
                <FinancialConsole />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/support-desk"
            element={
              <ProtectedRoute roles={["admin"]}>
                <SupportDesk />
              </ProtectedRoute>
            }
          />
          {/* Admin CSR Partner & Program Management Routes */}
          <Route
            path="/admin/csr/partners"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminCSRPartners />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/csr/partners/:partnerId"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminCSRPartners />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/csr/notifications"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminCSRNotifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/programs"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPrograms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/programs/create"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminProgramCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/programs/:programId/edit"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminProgramEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/programs/:programId"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminProgramDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/programs/:programId/schools"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminProgramSchools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/programs/:programId/checkpoints"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminProgramCheckpoints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/programs/:programId/metrics"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminProgramMetrics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/programs/:programId/reports"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminProgramReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/lifecycle"
            element={
              <ProtectedRoute roles={["admin"]}>
                <LifecycleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content-governance"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ContentGovernance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-timeline"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AuditTimeline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/configuration"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ConfigurationControlCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/communication"
            element={
              <ProtectedRoute roles={["admin"]}>
                <CommunicationSuite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/platform"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPlatform />
              </ProtectedRoute>
            }
          />

          {/* Parent Routes */}
          <Route
            path="/parent/overview"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/announcements"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/children"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentChildren />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/settings"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/upgrade"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentUpgrade />
              </ProtectedRoute>
            }
          />

          {/* Child Analytics Routes */}
          <Route
            path="/parent/child/:childId"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentChildAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/analytics"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentChildAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/progress"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ChildProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/wellbeing"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ChildMoodWellbeing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/wallet"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ChildWalletRewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/child/:childId/chat"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parent/profile"
            element={
              <ProtectedRoute roles={["parent"]}>
                <ParentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/notifications"
            element={
              <ProtectedRoute roles={["parent"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/parent-progress"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/progress"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Parent Game Routes */}
          <Route
            path="/parent/games"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentGamesHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/games/:category"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <ParentGameCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/games/:category/:gameId"
            element={
              <ProtectedRoute roles={["parent"]} requireApproved={true}>
                <UniversalParentGameRenderer />
              </ProtectedRoute>
            }
          />

          {/* Teacher Game Routes */}
          <Route
            path="/school-teacher/games"
            element={
              <TeacherProtectedRoute>
                <TeacherGamesHub />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/games/:category"
            element={
              <TeacherProtectedRoute>
                <TeacherGameCategoryPage />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/school-teacher/games/:category/:gameId"
            element={
              <TeacherProtectedRoute>
                <UniversalTeacherGameRenderer />
              </TeacherProtectedRoute>
            }
          />

          {/* Seller Routes */}
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute roles={["seller"]} requireApproved={true}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          {/* CSR Routes */}
          <Route
            path="/csr"
            element={<Navigate to="/csr/overview" replace />}
          />
          {/* CSR Status Pages (no sidebar layout) */}
          <Route
            path="/csr/pending-approval"
            element={
              <ProtectedRoute roles={["csr"]} requireApproved={false}>
                <CSRPendingApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/rejected"
            element={
              <ProtectedRoute roles={["csr"]} requireApproved={false}>
                <CSRRejected />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/no-program"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRNoProgram />
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/overview"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRProgramOverview />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/student-reach"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRStudentReach />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/engagement"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSREngagement />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/readiness-exposure"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRReadinessExposure />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/recognition"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRRecognition />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          {/* Legacy dashboard route - redirect to overview */}
          <Route
            path="/csr/dashboard"
            element={<Navigate to="/csr/overview" replace />}
          />
          <Route
            path="/csr/notifications"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRNotifications />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/schools"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRSchoolCoverageNew />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          {/* CSR Reports - Updated to use new Impact Reports page */}
          <Route
            path="/csr/reports"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRImpactReports />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/profile"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRProfile />
                </CSRLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/csr/settings"
            element={
              <ProtectedRoute roles={["csr"]}>
                <CSRLayout>
                  <CSRSettings />
                </CSRLayout>
              </ProtectedRoute>
            }
          />

          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/apply/:jobId" element={<CareerApply />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes></Suspense>
      </ErrorBoundary>
      <Toaster /> {/* Toast notification container */}
    </div>
  );
};

export default App;
