import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Link2, Copy, Check, QrCode, Mail, Download, Search, UserPlus } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import api from "../utils/api";
import { toast } from "react-hot-toast";

const InviteStudentsModal = ({ isOpen, onClose, classId, className, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("existing"); // existing, invite
  const [inviteLink, setInviteLink] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailList, setEmailList] = useState("");
  
  // Add Existing Student
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const hasClassContext = Boolean(classId);

  // Generate invite links when modal opens
  useEffect(() => {
    if (isOpen && classId) {
      generateInviteLinks();
      return;
    }

    if (isOpen && !classId) {
      setInviteLink("");
      setRegistrationLink("");
    }
  }, [isOpen, classId]);

  const generateInviteLinks = async () => {
    setLoading(true);
    try {
      // Generate regular invite link
      const inviteResponse = await api.post("/api/school/teacher/generate-invite", {
        classId,
        className
      });
      setInviteLink(inviteResponse.data.inviteLink);

      // Generate pre-filled registration link
      const regResponse = await api.post("/api/school/teacher/generate-registration-link", {
        classId,
        className
      });
      setRegistrationLink(regResponse.data.registrationLink);
    } catch (error) {
      console.error("Error generating invite links:", error);
      toast.error("Failed to generate invite links");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (link, type = "invite") => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success(`${type === "invite" ? "Invite" : "Registration"} link copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmails = async () => {
    const emails = emailList.split(",").map(e => e.trim()).filter(e => e);
    
    if (!registrationLink) {
      toast.error("Generate a registration link before sending invites");
      return;
    }

    if (emails.length === 0) {
      toast.error("Please enter at least one email address");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/school/teacher/send-invites", {
        emails,
        inviteLink: registrationLink,
        className
      });
      toast.success(`Invites sent to ${emails.length} email(s)!`);
      setEmailList("");
    } catch (error) {
      console.error("Error sending invites:", error);
      toast.error("Failed to send invites");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = (link, filename) => {
    const svg = document.getElementById(`qr-code-${filename}`);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.download = `${filename}-${className}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success("QR code downloaded!");
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Search existing students
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a registration number or phone");
      return;
    }

    setSearchLoading(true);
    try {
      const response = await api.get("/api/school/teacher/search-students", {
        params: { query: searchQuery }
      });
      const students = response.data.students || [];
      const mappedResults = students.map((student) => ({
        ...student,
        className: className || student.classes?.[0]?.name || student.metadata?.schoolEnrollment?.className || 'Unassigned',
      }));
      setSearchResults(mappedResults);
      if (students.length === 0) {
        toast("No students found", { icon: "ℹ️" });
      }
    } catch (error) {
      console.error("Error searching students:", error);
      toast.error("Failed to search students");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleToggleStudent = (student) => {
    setSelectedStudents(prev => {
      const exists = prev.find(s => s._id === student._id);
      if (exists) {
        return prev.filter(s => s._id !== student._id);
      }
      return [...prev, student];
    });
  };

  const handleAssignStudents = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/school/teacher/assign-students", {
        classId,
        className,
        studentIds: selectedStudents.map(s => s._id)
      });
      toast.success(`${selectedStudents.length} student(s) assigned to ${className}!`);
      setSelectedStudents([]);
      setSearchQuery("");
      setSearchResults([]);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error assigning students:", error);
      toast.error("Failed to assign students");
    } finally {
      setLoading(false);
    }
  };

  // CSV Upload
  const handleClose = () => {
    setEmailList("");
    setCopied(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedStudents([]);
    setActiveTab("existing");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Add Students</h2>
                  <p className="text-white/80 text-sm">
                    {className ? `Add students to ${className}` : "Add students to your class"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6">
            <button
              onClick={() => setActiveTab("existing")}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === "existing"
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Add Existing
              </div>
              {activeTab === "existing" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </button>
            
              <button
                onClick={() => setActiveTab("invite")}
                className={`px-6 py-3 font-medium transition-all relative ${
                  activeTab === "invite"
                    ? "text-indigo-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Invite New
                </div>
                {activeTab === "invite" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  />
                )}
              </button>
            </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Add Existing Student Tab */}
            {activeTab === "existing" && (
              <div className="space-y-6">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <div className="flex items-start gap-3">
                    <Search className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Search Existing Students</h3>
                      <p className="text-sm text-slate-600">
                        Search by registration number or phone number to find students already in the system.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Search Input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter email id..."
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearch}
                    disabled={searchLoading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {searchLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Search
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900">Search Results ({searchResults.length})</h4>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {searchResults.map((student) => (
                        <motion.div
                          key={student._id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => handleToggleStudent(student)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedStudents.find(s => s._id === student._id)
                              ? "bg-indigo-50 border-indigo-500"
                              : "bg-white border-slate-200 hover:border-indigo-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                                {student.name?.charAt(0) || "S"}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{student.name}</p>
                                <p className="text-sm text-gray-600">
                                  {student.registrationNumber || student.email}
                                </p>
                                <p className="text-xs text-gray-500">{student.phone}</p>
                              </div>
                            </div>
                            {selectedStudents.find(s => s._id === student._id) && (
                              <Check className="w-6 h-6 text-indigo-600" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assign Button */}
                {selectedStudents.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAssignStudents}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    {loading ? "Assigning..." : `Assign ${selectedStudents.length} Student(s) to ${className}`}
                  </motion.button>
                )}
              </div>
            )}

            {/* Invite New Student Tab */}
            {activeTab === "invite" && (
              <div className="space-y-6">
                {/* Pre-filled Registration Link */}
                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="bg-white p-4 rounded-xl shadow-lg">
                        {registrationLink ? (
                          <QRCodeSVG
                            id="qr-code-registration"
                            value={registrationLink}
                            size={160}
                            level="H"
                            includeMargin={true}
                          />
                        ) : loading ? (
                          <div className="w-40 h-40 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent" />
                          </div>
                        ) : (
                          <div className="w-40 h-40 flex flex-col items-center justify-center text-center text-xs text-slate-500">
                            <QrCode className="w-8 h-8 text-slate-400 mb-2" />
                            {hasClassContext
                              ? "Registration link unavailable"
                              : "Select a class to generate a QR code"}
                          </div>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownloadQR(registrationLink, "registration-qr")}
                        disabled={!registrationLink}
                        className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        Download QR
                      </motion.button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <UserPlus className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-bold text-slate-900">Pre-filled Registration Link</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        New students can scan this QR code or use the link below. Upon registration, 
                        they will be automatically assigned to <strong>{className || "your class"}</strong>.
                      </p>
                      
                      <div className="bg-white rounded-lg p-3 border border-indigo-200 mb-4">
                        <p className="text-xs text-slate-500 mb-1">How it works:</p>
                        <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                          <li>Student scans QR or clicks link</li>
                          <li>Registration form opens with class pre-selected</li>
                          <li>Student completes registration</li>
                          <li>System auto-assigns to {className || "your class"}</li>
                        </ol>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={registrationLink}
                          readOnly
                          className="flex-1 px-4 py-3 bg-white border border-indigo-200 rounded-lg font-mono text-sm"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCopyLink(registrationLink, "registration")}
                          disabled={!registrationLink}
                          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            copied
                              ? "bg-green-600 text-white"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        >
                          {copied ? (
                            <>
                              <Check className="w-5 h-5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5" />
                              Copy
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Invites */}
                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-900">Send Email Invites</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Enter student/parent email addresses (comma-separated) to send personalized registration invitations.
                  </p>
                  
                  <textarea
                    value={emailList}
                    onChange={(e) => setEmailList(e.target.value)}
                    placeholder="student1@example.com, parent1@example.com, student2@example.com"
                    rows={3}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all resize-none mb-3"
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendEmails}
                    disabled={loading || !emailList.trim() || !registrationLink}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    {loading ? "Sending..." : "Send Email Invites"}
                  </motion.button>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="w-full px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-all"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InviteStudentsModal;
