import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { Users, Plus, X, CheckCircle, Heart, AlertCircle, TrendingUp, UserPlus } from "lucide-react";

const FamilySupportMap = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-76";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Add family members, 2: Assign roles, 3: View map
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRelationship, setNewMemberRelationship] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);

  // Emotional roles
  const emotionalRoles = [
    {
      id: 'listener',
      label: 'Listener',
      description: 'Provides a safe space for others to share and be heard',
      emoji: '👂',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300'
    },
    {
      id: 'motivator',
      label: 'Motivator',
      description: 'Encourages and inspires others to pursue goals',
      emoji: '💪',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300'
    },
    {
      id: 'peacemaker',
      label: 'Peacemaker',
      description: 'Helps resolve conflicts and create harmony',
      emoji: '🕊️',
      color: 'from-purple-400 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300'
    },
    {
      id: 'comforter',
      label: 'Comforter',
      description: 'Offers emotional support and comfort during difficult times',
      emoji: '🤗',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300'
    },
    {
      id: 'organizer',
      label: 'Organizer',
      description: 'Helps coordinate and manage family activities and needs',
      emoji: '📋',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300'
    },
    {
      id: 'cheerleader',
      label: 'Cheerleader',
      description: 'Celebrates successes and provides positive reinforcement',
      emoji: '🎉',
      color: 'from-yellow-400 to-amber-500',
      bgColor: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300'
    },
    {
      id: 'advisor',
      label: 'Advisor',
      description: 'Provides guidance and wisdom when making decisions',
      emoji: '💡',
      color: 'from-cyan-400 to-teal-500',
      bgColor: 'from-cyan-50 to-teal-50',
      borderColor: 'border-cyan-300'
    }
  ];

  const relationshipTypes = [
    'Parent', 'Child', 'Spouse/Partner', 'Sibling', 'Grandparent', 'Other Family Member'
  ];

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;

    const newMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      relationship: newMemberRelationship || 'Family Member',
      roles: []
    };

    setFamilyMembers(prev => [...prev, newMember]);
    setNewMemberName("");
    setNewMemberRelationship("");
  };

  const handleToggleRole = (memberId, roleId) => {
    setFamilyMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        const hasRole = member.roles.includes(roleId);
        return {
          ...member,
          roles: hasRole
            ? member.roles.filter(r => r !== roleId)
            : [...member.roles, roleId]
        };
      }
      return member;
    }));
  };

  const analyzeGaps = () => {
    // Count how many people have each role
    const roleCounts = emotionalRoles.reduce((acc, role) => {
      acc[role.id] = familyMembers.filter(m => m.roles.includes(role.id)).length;
      return acc;
    }, {});

    // Find roles with no one assigned
    const missingRoles = emotionalRoles.filter(role => roleCounts[role.id] === 0);

    // Find people with too many roles (more than 3)
    const overloadedMembers = familyMembers.filter(m => m.roles.length > 3);

    // Find people with no roles
    const membersWithoutRoles = familyMembers.filter(m => m.roles.length === 0);

    // Check if roles are evenly distributed
    const totalRoles = familyMembers.reduce((sum, m) => sum + m.roles.length, 0);
    const avgRolesPerPerson = familyMembers.length > 0 ? totalRoles / familyMembers.length : 0;
    const isBalanced = avgRolesPerPerson >= 1 && avgRolesPerPerson <= 2.5 && overloadedMembers.length === 0;

    return {
      roleCounts,
      missingRoles,
      overloadedMembers,
      membersWithoutRoles,
      isBalanced,
      avgRolesPerPerson
    };
  };

  const handleComplete = () => {
    if (familyMembers.length >= 1) {
      setStep(3);
      setShowGameOver(true);
    }
  };

  const analysis = analyzeGaps();

  if (showGameOver && step === 3) {
    return (
      <ParentGameShell
        title={gameData?.title || "Family Support Map"}
        subtitle="Map Complete!"
        showGameOver={true}
        score={familyMembers.length >= 5 ? 5 : familyMembers.length}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={totalLevels}
        allAnswersCorrect={analysis.isBalanced}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-5xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-7xl mb-4"
              >
                🗺️
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Family Support Map</h2>
              <p className="text-lg text-gray-600 mb-6">
                Visualizing emotional roles and support distribution in your family.
              </p>
            </div>

            {/* Family Map Visualization */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Family Members & Roles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {familyMembers.map((member) => {
                  const memberRoles = member.roles.map(roleId => 
                    emotionalRoles.find(r => r.id === roleId)
                  ).filter(Boolean);
                  
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.relationship}</p>
                        </div>
                      </div>
                      
                      {memberRoles.length > 0 ? (
                        <div className="space-y-2">
                          {memberRoles.map((role) => (
                            <div
                              key={role.id}
                              className={`bg-gradient-to-br ${role.bgColor} rounded-lg px-3 py-2 border ${role.borderColor} flex items-center gap-2`}
                            >
                              <span className="text-xl">{role.emoji}</span>
                              <span className="text-sm font-semibold text-gray-800">{role.label}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No roles assigned</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Support Distribution Analysis
              </h3>
              
              {analysis.isBalanced ? (
                <div className="bg-green-100 rounded-lg p-4 border border-green-300 mb-4">
                  <p className="text-green-800 font-semibold">
                    ✅ Good balance! Support roles are well distributed across your family.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysis.missingRoles.length > 0 && (
                    <div className="bg-yellow-100 rounded-lg p-4 border border-yellow-300">
                      <p className="text-yellow-800 font-semibold mb-2">⚠️ Missing Roles:</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingRoles.map(role => (
                          <span key={role.id} className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm">
                            <span>{role.emoji}</span>
                            <span>{role.label}</span>
                          </span>
                        ))}
                      </div>
                      <p className="text-yellow-700 text-sm mt-2">Consider discussing these roles with your family.</p>
                    </div>
                  )}

                  {analysis.overloadedMembers.length > 0 && (
                    <div className="bg-orange-100 rounded-lg p-4 border border-orange-300">
                      <p className="text-orange-800 font-semibold mb-2">⚠️ Overloaded Members:</p>
                      <ul className="space-y-1">
                        {analysis.overloadedMembers.map(member => (
                          <li key={member.id} className="text-orange-700 text-sm">
                            <strong>{member.name}</strong> has {member.roles.length} roles - consider redistributing
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.membersWithoutRoles.length > 0 && (
                    <div className="bg-purple-100 rounded-lg p-4 border border-purple-300">
                      <p className="text-purple-800 font-semibold mb-2">💡 Members Without Roles:</p>
                      <p className="text-purple-700 text-sm">
                        {analysis.membersWithoutRoles.map(m => m.name).join(', ')} - Everyone can contribute to family support
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Role Distribution Stats */}
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Average roles per person:</strong> {analysis.avgRolesPerPerson.toFixed(1)}
                </p>
                <p className="text-xs text-gray-600">
                  Ideal range: 1-2.5 roles per person for balanced support distribution
                </p>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-green-600" />
                Key Insights
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Shared Responsibility:</strong> Everyone in the family can be a supporter. Distribute emotional roles so no one person carries all the weight.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Role Diversity:</strong> Having multiple people who can fulfill different emotional roles creates a resilient support system.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Balanced Support:</strong> When support roles are well-distributed, no single person becomes overwhelmed, and everyone feels valued.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span><strong>Open Communication:</strong> Discuss these roles with your family to ensure everyone understands and can contribute to family support.</span>
                </li>
              </ul>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Let everyone in the family be a supporter, not just one person. When emotional support roles are shared, it creates a stronger, more resilient family system where everyone contributes and everyone benefits. Children learn important life skills when they're given opportunities to be listeners, peacemakers, and supporters. This shared responsibility builds family connection and prevents any one person from carrying too much emotional weight.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Family Support Map"}
      subtitle={step === 1 ? "Add Family Members" : step === 2 ? "Assign Emotional Roles" : "View Map"}
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={step}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Family Support Map</h2>
            <p className="text-gray-600 text-lg">
              Visualize emotional roles within your family and identify support distribution.
            </p>
          </div>

          {/* Step 1: Add Family Members */}
          {step === 1 && (
            <>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Add Family Members</h3>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                    placeholder="Enter name"
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800"
                  />
                  <select
                    value={newMemberRelationship}
                    onChange={(e) => setNewMemberRelationship(e.target.value)}
                    className="px-4 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-gray-800 bg-white"
                  >
                    <option value="">Select relationship</option>
                    {relationshipTypes.map(rel => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddMember}
                    disabled={!newMemberName.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </motion.button>
                </div>
              </div>

              {/* Family Members List */}
              {familyMembers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Family Members ({familyMembers.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {familyMembers.map((member) => (
                      <div
                        key={member.id}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-gray-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.relationship}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setFamilyMembers(prev => prev.filter(m => m.id !== member.id))}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Continue Button */}
              {familyMembers.length >= 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Continue to Assign Roles
                  <CheckCircle className="w-5 h-5" />
                </motion.button>
              )}
            </>
          )}

          {/* Step 2: Assign Roles */}
          {step === 2 && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Assign Emotional Roles</h3>
                <p className="text-gray-600 mb-6">
                  Select which emotional roles each family member naturally fills. A person can have multiple roles.
                </p>

                {/* Family Members with Role Selection */}
                <div className="space-y-6">
                  {familyMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.relationship}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {emotionalRoles.map((role) => {
                          const isSelected = member.roles.includes(role.id);
                          return (
                            <motion.button
                              key={role.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleToggleRole(member.id, role.id)}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                isSelected
                                  ? `${role.bgColor} ${role.borderColor} border-4`
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{role.emoji}</span>
                                <span className={`font-semibold ${isSelected ? 'text-gray-800' : 'text-gray-700'}`}>
                                  {role.label}
                                </span>
                                {isSelected && (
                                  <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                                )}
                              </div>
                              <p className="text-xs text-gray-600">{role.description}</p>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                View Family Support Map
                <CheckCircle className="w-5 h-5" />
              </motion.button>
            </>
          )}

          {/* Parent Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mt-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Parent Tip:</strong> Let everyone in the family be a supporter, not just one person. When support roles are shared, it creates a stronger, more resilient family system. You earn 1 point for each family member added, up to 5 members.
            </p>
          </div>
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default FamilySupportMap;

