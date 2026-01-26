import { Brain } from "lucide-react";
import buildIds from "../buildGameIds";

export const brainGamesAdultIds = buildIds("brain", "adults");

export const getBrainAdultGames = (gameCompletionStatus) => {
  const brainAdultGames = [
    {
      id: "brain-adults-1",
      title: "Always On Mode",
      description:
        "An adult professional remains mentally engaged with work even after office hours.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-1"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/always-on-mode",
      index: 0,
      scenario: {
        setup:
          "An adult professional remains mentally engaged with work even after office hours.",
        choices: [
          {
            label: "Stay alert and responsive at all times",
            outcome: "Mental fatigue builds steadily",
          },
          {
            label: "Mentally disengage after work hours",
            outcome: "Mental space improves gradually",
          },
          {
            label: "Ignore the discomfort and continue as usual",
            outcome: "Stress accumulates unnoticed",
          },
        ],
        reflections: [
          "When does your mind stop working?",
          "What signals mental overload for you?",
        ],
        skill: "Mental boundary awareness",
      },
    },
    {
      id: "brain-adults-2",
      title: "Responsibility Pile-Up",
      description:
        "An adult manages work, family duties, and personal commitments simultaneously.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-2"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/responsibility-pile-up",
      index: 1,
      scenario: {
        setup:
          "An adult manages work, family duties, and personal commitments simultaneously.",
        choices: [
          {
            label: "Try to handle everything without adjustment",
            outcome: "Exhaustion increases",
          },
          {
            label: "Acknowledge limits and prioritise",
            outcome: "Control improves slowly",
          },
          {
            label: "Avoid thinking about the pressure",
            outcome: "Stress resurfaces later",
          },
        ],
        reflections: [
          "Which responsibilities feel heaviest?",
          "What happens when limits are ignored?",
        ],
        skill: "Capacity awareness",
      },
    },
    {
      id: "brain-adults-3",
      title: "Silent Burn",
      description:
        "An adult feels tired and irritable but continues daily routines.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-3"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/silent-burn",
      index: 2,
      scenario: {
        setup:
          "An adult feels tired and irritable but continues daily routines.",
        choices: [
          {
            label: "Ignore the feeling and keep going",
            outcome: "Burnout risk increases",
          },
          {
            label: "Notice the change in energy",
            outcome: "Awareness improves",
          },
          {
            label: "Distract with constant activity",
            outcome: "Fatigue deepens",
          },
        ],
        reflections: [
          "What signs show silent exhaustion?",
          "How early do you notice them?",
        ],
        skill: "Burnout signal awareness",
      },
    },
    {
      id: "brain-adults-4",
      title: "Deadline Collision",
      description:
        "Multiple work and personal deadlines fall on the same week.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-4"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/deadline-collision",
      index: 3,
      scenario: {
        setup:
          "Multiple work and personal deadlines fall on the same week.",
        choices: [
          {
            label: "Rush through everything",
            outcome: "Errors and stress increase",
          },
          {
            label: "Re-evaluate priorities calmly",
            outcome: "Control improves",
          },
          {
            label: "Delay decisions",
            outcome: "Anxiety builds",
          },
        ],
        reflections: [
          "How do you react to overlapping demands?",
          "What restores control for you?",
        ],
        skill: "Adaptive planning awareness",
      },
    },
    {
      id: "brain-adults-5",
      title: "Carrying It Home",
      description:
        "Work stress affects mood at home.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-5"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/carrying-it-home",
      index: 4,
      scenario: {
        setup:
          "Work stress affects mood at home.",
        choices: [
          {
            label: "Release stress at home",
            outcome: "Relationship tension increases",
          },
          {
            label: "Recognise spillover and pause",
            outcome: "Emotional balance improves",
          },
          {
            label: "Suppress emotions",
            outcome: "Stress accumulates internally",
          },
        ],
        reflections: [
          "When does work affect home life?",
          "How do you notice emotional spillover?",
        ],
        skill: "Spillover awareness",
      },
    },
    {
      id: "brain-adults-6",
      title: "Productivity Guilt",
      description:
        "An adult feels guilty when resting or slowing down.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-6"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/productivity-guilt",
      index: 5,
      scenario: {
        setup:
          "An adult feels guilty when resting or slowing down.",
        choices: [
          {
            label: "Self-criticise for resting",
            outcome: "Mental pressure increases",
          },
          {
            label: "Accept rest as necessary",
            outcome: "Balance improves",
          },
          {
            label: "Avoid resting completely",
            outcome: "Fatigue deepens",
          },
        ],
        reflections: [
          "What beliefs affect your rest?",
          "How does guilt affect energy?",
        ],
        skill: "Rest perception awareness",
      },
    },
    {
      id: "brain-adults-7",
      title: "Never Enough Time",
      description:
        "An adult feels there is never enough time to complete everything.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-7"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/never-enough-time",
      index: 6,
      scenario: {
        setup:
          "An adult feels there is never enough time to complete everything.",
        choices: [
          {
            label: "Rush faster",
            outcome: "Stress intensifies",
          },
          {
            label: "Slow down and reassess",
            outcome: "Clarity improves",
          },
          {
            label: "Ignore the feeling",
            outcome: "Pressure persists",
          },
        ],
        reflections: [
          "What makes time feel insufficient?",
          "How does slowing change perception?",
        ],
        skill: "Time pressure awareness",
      },
    },
    {
      id: "brain-adults-8",
      title: "Holding It Together",
      description:
        "An adult feels pressure to appear strong for others.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-8"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/holding-it-together",
      index: 7,
      scenario: {
        setup:
          "An adult feels pressure to appear strong for others.",
        choices: [
          {
            label: "Hide all struggles",
            outcome: "Internal stress builds",
          },
          {
            label: "Acknowledge inner strain",
            outcome: "Self-awareness improves",
          },
          {
            label: "Distract with busyness",
            outcome: "Emotional fatigue increases",
          },
        ],
        reflections: [
          "Who do you feel strong for?",
          "What happens when strain is hidden?",
        ],
        skill: "Emotional honesty awareness",
      },
    },
    {
      id: "brain-adults-9",
      title: "Constant Catch-Up",
      description:
        "An adult feels behind despite continuous effort.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-9"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/constant-catch-up",
      index: 8,
      scenario: {
        setup:
          "An adult feels behind despite continuous effort.",
        choices: [
          {
            label: "Push harder",
            outcome: "Exhaustion increases",
          },
          {
            label: "Reassess expectations",
            outcome: "Perspective improves",
          },
          {
            label: "Avoid reflecting",
            outcome: "Frustration grows",
          },
        ],
        reflections: [
          "What makes you feel behind?",
          "How do expectations affect stress?",
        ],
        skill: "Expectation awareness",
      },
    },
    {
      id: "brain-adults-10",
      title: "Mental Reset Point",
      description:
        "After prolonged pressure, energy feels low.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-10"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/mental-reset-point",
      index: 9,
      scenario: {
        setup:
          "After prolonged pressure, energy feels low.",
        choices: [
          {
            label: "Ignore fatigue",
            outcome: "Burnout deepens",
          },
          {
            label: "Pause and reflect",
            outcome: "Recovery begins",
          },
          {
            label: "Withdraw completely",
            outcome: "Confidence reduces",
          },
        ],
        reflections: [
          "What signals mental exhaustion?",
          "What helps you reset?",
        ],
        skill: "Mental reset awareness",
      },
    },
    {
      id: "brain-adults-11",
      title: "Waiting for the Outcome",
      description:
        "An adult is waiting for an important work or personal outcome.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-11"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/waiting-for-the-outcome",
      index: 10,
      scenario: {
        setup:
          "An adult is waiting for an important work or personal outcome.",
        choices: [
          {
            label: "Constantly imagine negative outcomes",
            outcome: "Anxiety increases steadily",
          },
          {
            label: "Focus on daily routines",
            outcome: "Mental balance improves",
          },
          {
            label: "Avoid thinking about the situation",
            outcome: "Worry returns unexpectedly",
          },
        ],
        reflections: [
          "How do you react to uncertainty?",
          "What helps you stay grounded?",
        ],
        skill: "Uncertainty tolerance awareness",
      },
    },
    {
      id: "brain-adults-12",
      title: "Fear of Making the Wrong Choice",
      description:
        "An adult faces a decision with long-term impact.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-12"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/fear-of-making-the-wrong-choice",
      index: 11,
      scenario: {
        setup:
          "An adult faces a decision with long-term impact.",
        choices: [
          {
            label: "Delay the decision repeatedly",
            outcome: "Stress builds over time",
          },
          {
            label: "Decide with available information",
            outcome: "Confidence stabilises",
          },
          {
            label: "Let others decide",
            outcome: "Self-trust reduces",
          },
        ],
        reflections: [
          "What decisions feel most risky?",
          "How does avoidance affect you?",
        ],
        skill: "Decision confidence awareness",
      },
    },
    {
      id: "brain-adults-13",
      title: "What If Loop",
      description:
        "An adult repeatedly imagines worst-case future scenarios.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-13"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/what-if-loop",
      index: 12,
      scenario: {
        setup:
          "An adult repeatedly imagines worst-case future scenarios.",
        choices: [
          {
            label: "Engage with every worry",
            outcome: "Anxiety escalates",
          },
          {
            label: "Notice thoughts and refocus",
            outcome: "Mental calm improves",
          },
          {
            label: "Force thoughts away",
            outcome: "Thoughts return stronger",
          },
        ],
        reflections: [
          "Which thoughts repeat most?",
          "How do you usually respond?",
        ],
        skill: "Thought pattern awareness",
      },
    },
    {
      id: "brain-adults-14",
      title: "Fear of Falling Behind",
      description:
        "Peers appear to progress faster in life or career.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-14"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/fear-of-falling-behind",
      index: 13,
      scenario: {
        setup:
          "Peers appear to progress faster in life or career.",
        choices: [
          {
            label: "Rush decisions",
            outcome: "Stress increases",
          },
          {
            label: "Focus on personal pace",
            outcome: "Stability improves",
          },
          {
            label: "Withdraw from comparison",
            outcome: "Perspective improves",
          },
        ],
        reflections: [
          "Who do you compare yourself with?",
          "What pace feels sustainable?",
        ],
        skill: "Self-paced growth awareness",
      },
    },
    {
      id: "brain-adults-15",
      title: "Fear of Starting Again",
      description:
        "An adult hesitates to restart after a setback.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-15"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/fear-of-starting-again",
      index: 14,
      scenario: {
        setup:
          "An adult hesitates to restart after a setback.",
        choices: [
          {
            label: "Avoid starting again",
            outcome: "Regret increases",
          },
          {
            label: "Begin with a small step",
            outcome: "Confidence builds gradually",
          },
          {
            label: "Wait for confidence",
            outcome: "Momentum remains low",
          },
        ],
        reflections: [
          "What stops you from restarting?",
          "How do small steps change fear?",
        ],
        skill: "Restart awareness",
      },
    },
    {
      id: "brain-adults-16",
      title: "Fear of Judgement",
      description:
        "An adult worries about being judged for choices or lifestyle.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-16"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/fear-of-judgement",
      index: 15,
      scenario: {
        setup:
          "An adult worries about being judged for choices or lifestyle.",
        choices: [
          {
            label: "Avoid situations",
            outcome: "Opportunities reduce",
          },
          {
            label: "Act despite discomfort",
            outcome: "Confidence grows slowly",
          },
          {
            label: "Seek constant reassurance",
            outcome: "Dependence increases",
          },
        ],
        reflections: [
          "Whose judgement affects you most?",
          "What happens when you face it?",
        ],
        skill: "Social confidence awareness",
      },
    },
    {
      id: "brain-adults-17",
      title: "Unclear Future",
      description:
        "An adult feels unsure about long-term direction.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-17"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/unclear-future",
      index: 16,
      scenario: {
        setup:
          "An adult feels unsure about long-term direction.",
        choices: [
          {
            label: "Avoid thinking about the future",
            outcome: "Anxiety increases",
          },
          {
            label: "Explore options gradually",
            outcome: "Clarity improves over time",
          },
          {
            label: "Follow others' paths",
            outcome: "Dissatisfaction appears later",
          },
        ],
        reflections: [
          "What makes the future feel unclear?",
          "How does exploration help?",
        ],
        skill: "Future clarity awareness",
      },
    },
    {
      id: "brain-adults-18",
      title: "After the Mistake",
      description:
        "An error occurs at work or in a personal responsibility.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-18"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/after-the-mistake",
      index: 17,
      scenario: {
        setup:
          "An error occurs at work or in a personal responsibility.",
        choices: [
          {
            label: "Hide the mistake",
            outcome: "Stress increases",
          },
          {
            label: "Acknowledge it",
            outcome: "Confidence rebuilds",
          },
          {
            label: "Blame circumstances",
            outcome: "Learning reduces",
          },
        ],
        reflections: [
          "How do you react to mistakes?",
          "What helps you move forward?",
        ],
        skill: "Mistake response awareness",
      },
    },
    {
      id: "brain-adults-19",
      title: "Pressure to Be Stable",
      description:
        "An adult feels expected to always be financially and emotionally stable.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-19"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/pressure-to-be-stable",
      index: 18,
      scenario: {
        setup:
          "An adult feels expected to always be financially and emotionally stable.",
        choices: [
          {
            label: "Suppress concerns",
            outcome: "Stress builds silently",
          },
          {
            label: "Acknowledge internal pressure",
            outcome: "Self-awareness improves",
          },
          {
            label: "Overcompensate with effort",
            outcome: "Fatigue increases",
          },
        ],
        reflections: [
          "What expectations feel heavy?",
          "How do they affect you?",
        ],
        skill: "Stability pressure awareness",
      },
    },
    {
      id: "brain-adults-20",
      title: "Facing the Outcome",
      description:
        "An adult receives an outcome different from expectations.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-20"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/facing-the-outcome",
      index: 19,
      scenario: {
        setup:
          "An adult receives an outcome different from expectations.",
        choices: [
          {
            label: "Self-criticise harshly",
            outcome: "Confidence drops",
          },
          {
            label: "Reflect and recalibrate",
            outcome: "Resilience increases",
          },
          {
            label: "Avoid future attempts",
            outcome: "Opportunities reduce",
          },
        ],
        reflections: [
          "How do outcomes affect your self-view?",
          "What helps recovery?",
        ],
        skill: "Outcome resilience awareness",
      },
    },
    {
      id: "brain-adults-21",
      title: "Sudden Irritation",
      description:
        "An adult feels irritated during a normal conversation.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-21"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/sudden-irritation",
      index: 20,
      scenario: {
        setup:
          "An adult feels irritated during a normal conversation.",
        choices: [
          {
            label: "React immediately with frustration",
            outcome: "Conflict increases",
          },
          {
            label: "Pause and notice the emotion",
            outcome: "Awareness improves",
          },
          {
            label: "Suppress the feeling",
            outcome: "Emotion resurfaces later",
          },
        ],
        reflections: [
          "What usually triggers irritation?",
          "How early do you notice it?",
        ],
        skill: "Emotional awareness",
      },
    },
    {
      id: "brain-adults-22",
      title: "Mixed Feelings",
      description:
        "An adult feels excitement and anxiety about the same situation.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-22"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/mixed-feelings",
      index: 21,
      scenario: {
        setup:
          "An adult feels excitement and anxiety about the same situation.",
        choices: [
          {
            label: "Ignore uncomfortable feelings",
            outcome: "Confusion remains",
          },
          {
            label: "Acknowledge both emotions",
            outcome: "Clarity improves",
          },
          {
            label: "Focus only on anxiety",
            outcome: "Stress increases",
          },
        ],
        reflections: [
          "Which emotions often appear together?",
          "How does acknowledgment help?",
        ],
        skill: "Emotional clarity",
      },
    },
    {
      id: "brain-adults-23",
      title: "Emotional Build-Up",
      description:
        "Stressful days pass without emotional release.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-23"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/emotional-build-up",
      index: 22,
      scenario: {
        setup:
          "Stressful days pass without emotional release.",
        choices: [
          {
            label: "Release emotions suddenly",
            outcome: "Relief followed by discomfort",
          },
          {
            label: "Address emotions gradually",
            outcome: "Balance improves",
          },
          {
            label: "Ignore emotions",
            outcome: "Emotional overload appears later",
          },
        ],
        reflections: [
          "How do emotions build up for you?",
          "What helps gradual release?",
        ],
        skill: "Emotional regulation awareness",
      },
    },
    {
      id: "brain-adults-24",
      title: "Feeling Disconnected",
      description:
        "An adult feels emotionally distant from daily life.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-24"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/feeling-disconnected",
      index: 23,
      scenario: {
        setup:
          "An adult feels emotionally distant from daily life.",
        choices: [
          {
            label: "Ignore the feeling",
            outcome: "Disconnection continues",
          },
          {
            label: "Notice and reflect on it",
            outcome: "Awareness increases",
          },
          {
            label: "Force emotional reactions",
            outcome: "Frustration increases",
          },
        ],
        reflections: [
          "When do you feel disconnected?",
          "What helps reconnection?",
        ],
        skill: "Emotional sensitivity awareness",
      },
    },
    {
      id: "brain-adults-25",
      title: "Anger Without Warning",
      description:
        "A small event triggers unexpected anger.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-adults-25"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/adults/anger-without-warning",
      index: 24,
      scenario: {
        setup:
          "A small event triggers unexpected anger.",
        choices: [
          {
            label: "Express anger immediately",
            outcome: "Conflict escalates",
          },
          {
            label: "Pause and reflect",
            outcome: "Control improves",
          },
          {
            label: "Suppress anger",
            outcome: "Anger resurfaces later",
          },
        ],
        reflections: [
          "What triggers anger for you?",
          "How do you usually respond?",
        ],
        skill: "Anger awareness",
      },
    },
  ];

  return brainAdultGames;
};