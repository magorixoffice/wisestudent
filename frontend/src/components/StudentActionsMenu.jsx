import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, MessageSquare, FileText, Eye, Users, Flag, TrendingUp, UserMinus } from "lucide-react";

const StudentActionsMenu = ({ 
  student, 
  onMessage, 
  onAddNote, 
  onViewDetails, 
  onAssignToGroup,
  onViewFullProfile,
  onRemoveFromClass 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Calculate menu position when opening
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const menuWidth = 224;
          const menuHeight = 36 + actions.length * 44 + 16;
          const viewportPadding = 8;
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          let top = rect.bottom + viewportPadding;
          if (top + menuHeight > viewportHeight - viewportPadding) {
            top = rect.top - menuHeight - viewportPadding;
          }
          top = Math.max(viewportPadding, top);

          let left = rect.right - menuWidth;
          left = Math.min(viewportWidth - menuWidth - viewportPadding, Math.max(viewportPadding, left));

          setMenuPosition({ top, left });
        }
      };
      updatePosition();
      // Update position on scroll/resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  const handleAction = (action) => {
    action(student);
    setIsOpen(false);
  };

  const actions = [
    {
      label: "Message",
      icon: MessageSquare,
      action: onMessage
    },
    {
      label: "Add Note",
      icon: FileText,
      action: onAddNote
    },
    {
      label: "View Details",
      icon: Eye,
      action: onViewDetails
    },
    {
      label: "Assign to Group",
      icon: Users,
      action: onAssignToGroup
    },
    {
      label: "Full Profile",
      icon: TrendingUp,
      action: onViewFullProfile
    },
    {
      label: "Remove from Class",
      icon: UserMinus,
      action: onRemoveFromClass
    }
  ];

  return (
    <>
      <div className="relative inline-block" ref={menuRef}>
        <motion.button
          ref={buttonRef}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={`p-2 rounded-lg transition-all cursor-pointer border flex-shrink-0 ${
            isOpen 
              ? 'bg-slate-100 border-slate-300 shadow-sm' 
              : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          <MoreVertical className={`w-4 h-4 ${isOpen ? 'text-indigo-600' : 'text-slate-600'}`} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[9998]"
            />
            
            {/* Menu - rendered in portal to avoid layout shifts */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-[9999]"
              style={{
                width: '224px',
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2.5 border-b border-white/20">
                <h3 className="text-white font-bold text-xs uppercase tracking-wide">Actions</h3>
              </div>
              
              {/* Actions */}
              <div className="p-1.5">
                {actions.map((action, index) => {
                  const Icon = action.icon;
                  const actionStyles = {
                    Message: {
                      iconBg: "bg-blue-100",
                      iconColor: "text-blue-600",
                      hoverBg: "hover:bg-blue-50",
                      textColor: "text-slate-700"
                    },
                    "Add Note": {
                      iconBg: "bg-purple-100",
                      iconColor: "text-purple-600",
                      hoverBg: "hover:bg-purple-50",
                      textColor: "text-slate-700"
                    },
                    "View Details": {
                      iconBg: "bg-emerald-100",
                      iconColor: "text-emerald-600",
                      hoverBg: "hover:bg-emerald-50",
                      textColor: "text-slate-700"
                    },
                    "Assign to Group": {
                      iconBg: "bg-amber-100",
                      iconColor: "text-amber-600",
                      hoverBg: "hover:bg-amber-50",
                      textColor: "text-slate-700"
                    },
                    "Full Profile": {
                      iconBg: "bg-pink-100",
                      iconColor: "text-pink-600",
                      hoverBg: "hover:bg-pink-50",
                      textColor: "text-slate-700"
                    },
                    "Remove from Class": {
                      iconBg: "bg-red-100",
                      iconColor: "text-red-600",
                      hoverBg: "hover:bg-red-50",
                      textColor: "text-slate-700"
                    }
                  };
                  
                  const style = actionStyles[action.label] || actionStyles.Message;
                  
                  return (
                    <motion.button
                      key={action.label}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(action.action);
                      }}
                      className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-lg transition-all ${style.hoverBg} ${
                        index < actions.length - 1 ? "mb-1" : ""
                      }`}
                    >
                      <div className={`${style.iconBg} ${style.iconColor} rounded-lg p-1.5 flex-shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`font-semibold text-sm ${style.textColor} flex-1 text-left`}>
                        {action.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentActionsMenu;

