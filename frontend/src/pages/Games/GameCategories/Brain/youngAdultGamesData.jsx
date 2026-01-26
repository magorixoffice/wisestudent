import { Brain, Target } from "lucide-react";
import buildIds from "../buildGameIds";

export const brainGamesYoungAdultIds = buildIds("brain", "young-adult");

export const getBrainYoungAdultGames = (gameCompletionStatus) => {
  const brainYoungAdultGames = [
    {
      id: "brain-young-adult-1",
      title: "Too Many Commitments",
      description:
        "A college student faces exams, a part-time job, and family pressure—prioritize to protect focus.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "7 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-1"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/too-many-commitments",
      index: 0,
      scenario: {
        setup:
          "A student juggling exams, part-time work, and family expectations triggers stress when multiple deadlines collide.",
        choices: [
          {
            label: "Complete everything as planned",
            outcome: "Stress increases and focus decreases."
          },
          {
            label: "Prioritize tasks and postpone others",
            outcome: "Pressure reduces but some work stays pending."
          },
          {
            label: "Avoid planning and hope it works out",
            outcome: "Anxiety rises due to lack of control."
          }
        ],
        reflections: [
          "What signs show that pressure is building?",
          "Which tasks truly need immediate attention?"
        ],
        skill: "Prioritisation awareness"
      },
    },
    {
      id: "brain-young-adult-2",
      title: "Saying Yes Again",
      description:
        "A young adult learns to say no without guilt so the mental load stays manageable.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-2"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/saying-yes-again",
      index: 1,
      scenario: {
        setup:
          "A young adult already busy with studies and work receives more requests for help and favors.",
        choices: [
          {
            label: "Agree to help everyone despite feeling exhausted",
            outcome: "Stress increases and energy levels drop."
          },
          {
            label: "Say no politely and explain current limits",
            outcome: "Discomfort appears but mental load reduces."
          },
          {
            label: "Ignore messages to avoid confrontation",
            outcome: "Temporary relief is followed by tension later."
          }
        ],
        reflections: [
          "Why does saying no feel difficult?",
          "What happens when personal limits are ignored?"
        ],
        skill: "Boundary awareness"
      },
    },
    {
      id: "brain-young-adult-3",
      title: "Pressure Signals",
      description:
        "A student recognizes physical and emotional stress signs during a busy academic period.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-3"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/pressure-signals",
      index: 2,
      scenario: {
        setup:
          "A student notices headaches, irritation, and lack of focus during a busy academic period.",
        choices: [
          {
            label: "Ignore the signs and continue working",
            outcome: "Stress builds silently over time."
          },
          {
            label: "Slow down and acknowledge the pressure",
            outcome: "Awareness increases and pressure stabilises."
          },
          {
            label: "Distract with social media and entertainment",
            outcome: "Temporary relief followed by delayed stress."
          }
        ],
        reflections: [
          "What signs usually appear when stress increases?",
          "What happens when these signs are ignored?"
        ],
        skill: "Stress signal recognition"
      },
    },
    {
      id: "brain-young-adult-4",
      title: "Deadline Collision",
      description:
        "Two important deadlines suddenly fall on the same day - learn to adapt and prioritize.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-4"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/deadline-collision",
      index: 3,
      scenario: {
        setup:
          "Two important deadlines suddenly fall on the same day.",
        choices: [
          {
            label: "Rush both tasks without planning",
            outcome: "Quality reduces and stress increases."
          },
          {
            label: "Re-evaluate priorities and adjust effort",
            outcome: "Control improves, though not everything is perfect."
          },
          {
            label: "Avoid deciding until the last moment",
            outcome: "Anxiety increases due to uncertainty."
          }
        ],
        reflections: [
          "How do you react when plans change suddenly?",
          "What helps you regain control?"
        ],
        skill: "Adaptive planning"
      },
    },
    {
      id: "brain-young-adult-5",
      title: "Comparison Pressure",
      description:
        "A young adult sees peers appearing successful and calm online, learning to handle comparison pressure.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-5"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/comparison-pressure",
      index: 4,
      scenario: {
        setup:
          "A young adult sees peers appearing successful and calm online.",
        choices: [
          {
            label: "Constantly compare progress with others",
            outcome: "Confidence decreases over time."
          },
          {
            label: "Limit exposure and refocus on personal goals",
            outcome: "Mental clarity improves."
          },
          {
            label: "Dismiss feelings without addressing them",
            outcome: "Emotions resurface later."
          }
        ],
        reflections: [
          "Who do you compare yourself with most?",
          "How does comparison affect your stress?"
        ],
        skill: "Self-comparison awareness"
      },
    },
    {
      id: "brain-young-adult-6",
      title: "No Break Day",
      description:
        "A young adult works continuously without taking breaks to stay productive, learning to manage energy effectively.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-6"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/no-break-day",
      index: 5,
      scenario: {
        setup:
          "A young adult works continuously without taking breaks to stay productive.",
        choices: [
          {
            label: "Continue working without breaks",
            outcome: "Energy drops and mistakes increase."
          },
          {
            label: "Take short breaks to reset",
            outcome: "Focus stabilises and stress reduces."
          },
          {
            label: "Stop completely for the day",
            outcome: "Rest improves but guilt appears."
          }
        ],
        reflections: [
          "How do breaks affect your focus?",
          "What happens when rest is ignored?"
        ],
        skill: "Energy management awareness"
      },
    },
    {
      id: "brain-young-adult-7",
      title: "Family Expectations",
      description:
        "Family expectations increase pressure during exams or job search, learning to communicate emotional boundaries.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-7"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/family-expectations",
      index: 6,
      scenario: {
        setup:
          "Family expectations increase pressure during exams or job search.",
        choices: [
          {
            label: "Suppress feelings and push harder",
            outcome: "Internal stress builds silently."
          },
          {
            label: "Communicate limits calmly",
            outcome: "Understanding improves gradually."
          },
          {
            label: "React emotionally",
            outcome: "Conflict increases pressure."
          }
        ],
        reflections: [
          "How do expectations affect your stress?",
          "What helps reduce emotional pressure?"
        ],
        skill: "Emotional communication awareness"
      },
    },
    {
      id: "brain-young-adult-8",
      title: "Last-Minute Panic",
      description:
        "Tasks pile up due to repeated delays, learning to break them down into smaller steps.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-8"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/last-minute-panic",
      index: 7,
      scenario: {
        setup:
          "Tasks pile up due to repeated delays.",
        choices: [
          {
            label: "Panic and rush through everything",
            outcome: "Errors increase and stress spikes."
          },
          {
            label: "Break tasks into smaller steps",
            outcome: "Control improves gradually."
          },
          {
            label: "Avoid the situation",
            outcome: "Pressure continues to build."
          }
        ],
        reflections: [
          "What causes delays in your work?",
          "How do small steps change pressure?"
        ],
        skill: "Task breakdown awareness"
      },
    },
    {
      id: "brain-young-adult-9",
      title: "Control vs Concern",
      description:
        "A young adult worries about many things beyond control, learning to focus on what can be managed.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-9"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/control-vs-concern",
      index: 8,
      scenario: {
        setup:
          "A young adult worries about many things beyond control.",
        choices: [
          {
            label: "Worry about everything",
            outcome: "Anxiety increases."
          },
          {
            label: "Focus on controllable actions",
            outcome: "Mental clarity improves."
          },
          {
            label: "Avoid thinking about it",
            outcome: "Stress returns later."
          }
        ],
        reflections: [
          "What worries are outside your control?",
          "What actions are within your control?"
        ],
        skill: "Cognitive load awareness"
      },
    },
    {
      id: "brain-young-adult-10",
      title: "Reset Point",
      description:
        "Stress peaks after weeks of pressure, learning when and how to reset effectively.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-10"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/reset-point",
      index: 9,
      scenario: {
        setup:
          "Stress peaks after weeks of pressure.",
        choices: [
          {
            label: "Push harder without change",
            outcome: "Burnout risk increases."
          },
          {
            label: "Pause and reorganise priorities",
            outcome: "Recovery begins."
          },
          {
            label: "Withdraw completely",
            outcome: "Confidence reduces."
          }
        ],
        reflections: [
          "What signals tell you a reset is needed?",
          "What does a healthy reset look like?"
        ],
        skill: "Resilience awareness"
      },
    },
    {
      id: "brain-young-adult-11",
      title: "The Unknown Result",
      description:
        "A student has completed an important exam but results are pending, learning to handle uncertainty effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-11"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/the-unknown-result",
      index: 10,
      scenario: {
        setup:
          "A student has completed an important exam but results are pending.",
        choices: [
          {
            label: "Constantly imagine worst-case outcomes",
            outcome: "Anxiety increases over time."
          },
          {
            label: "Focus on daily routines and tasks",
            outcome: "Mental balance improves."
          },
          {
            label: "Avoid thinking about the result entirely",
            outcome: "Worry resurfaces unexpectedly."
          }
        ],
        reflections: [
          "How do you usually react to uncertainty?",
          "What helps you stay grounded while waiting?"
        ],
        skill: "Uncertainty tolerance awareness"
      },
    },
    {
      id: "brain-young-adult-12",
      title: "Fear Before the Interview",
      description:
        "A young adult prepares for an important interview, learning to manage fear and find balance in preparation.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-12"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/fear-before-the-interview",
      index: 11,
      scenario: {
        setup:
          "A young adult prepares for an important interview.",
        choices: [
          {
            label: "Avoid preparing to reduce stress",
            outcome: "Confidence drops."
          },
          {
            label: "Prepare calmly and accept uncertainty",
            outcome: "Confidence stabilises."
          },
          {
            label: "Over-prepare obsessively",
            outcome: "Stress increases despite preparation."
          }
        ],
        reflections: [
          "How does fear affect your preparation?",
          "What balance feels healthy?"
        ],
        skill: "Fear-response awareness"
      },
    },
    {
      id: "brain-young-adult-13",
      title: "What If Thoughts",
      description:
        "A student repeatedly thinks about negative future possibilities, learning to manage anxious thoughts effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-13"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/what-if-thoughts",
      index: 12,
      scenario: {
        setup:
          "A student repeatedly thinks about negative future possibilities.",
        choices: [
          {
            label: "Engage with every \"what if.\"",
            outcome: "Anxiety escalates."
          },
          {
            label: "Acknowledge thoughts and refocus.",
            outcome: "Mental calm improves."
          },
          {
            label: "Suppress thoughts forcefully.",
            outcome: "Thoughts return stronger later."
          }
        ],
        reflections: [
          "What thoughts increase your anxiety most?",
          "How do you usually respond to them?"
        ],
        skill: "Thought pattern awareness"
      },
    },
    {
      id: "brain-young-adult-14",
      title: "Fear of Disappointing Others",
      description:
        "Family or mentors expect strong performance, learning to manage the fear of letting others down.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-14"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/fear-of-disappointing-others",
      index: 13,
      scenario: {
        setup:
          "Family or mentors expect strong performance.",
        choices: [
          {
            label: "Internalise pressure silently.",
            outcome: "Internal stress increases."
          },
          {
            label: "Communicate honestly about limits.",
            outcome: "Pressure reduces gradually."
          },
          {
            label: "Avoid conversations.",
            outcome: "Tension builds over time."
          }
        ],
        reflections: [
          "Whose expectations affect you most?",
          "How do expectations influence your anxiety?"
        ],
        skill: "Expectation management awareness"
      },
    },
    {
      id: "brain-young-adult-15",
      title: "Fear of Starting",
      description:
        "A task feels overwhelming before starting, learning to overcome the fear of failure that prevents action.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-15"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/fear-of-starting",
      index: 14,
      scenario: {
        setup:
          "A task feels overwhelming before starting.",
        choices: [
          {
            label: "Delay starting further.",
            outcome: "Anxiety increases."
          },
          {
            label: "Start with a small step.",
            outcome: "Confidence builds gradually."
          },
          {
            label: "Wait for motivation.",
            outcome: "Task remains unfinished."
          }
        ],
        reflections: [
          "What stops you from starting tasks?",
          "How do small steps change fear?"
        ],
        skill: "Action initiation awareness"
      },
    },
    {
      id: "brain-young-adult-16",
      title: "Fear of Being Judged",
      description:
        "A young adult worries about others' opinions, learning to manage the fear of negative judgement.",
      icon: <Target className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-16"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/fear-of-being-judged",
      index: 15,
      scenario: {
        setup:
          "A young adult worries about others' opinions.",
        choices: [
          {
            label: "Avoid situations entirely.",
            outcome: "Opportunities reduce."
          },
          {
            label: "Participate despite discomfort.",
            outcome: "Confidence grows slowly."
          },
          {
            label: "Seek constant reassurance.",
            outcome: "Dependence increases."
          }
        ],
        reflections: [
          "How does judgement fear affect you?",
          "What happens when you face it?"
        ],
        skill: "Social confidence awareness"
      },
    },
    {
      id: "brain-young-adult-17",
      title: "Unclear Future Path",
      description:
        "A student feels unsure about career direction, learning to manage the fear of choosing the wrong path.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-17"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/unclear-future-path",
      index: 16,
      scenario: {
        setup:
          "A student feels unsure about career direction.",
        choices: [
          {
            label: "Avoid making any decision.",
            outcome: "Uncertainty increases."
          },
          {
            label: "Explore options gradually.",
            outcome: "Clarity improves over time."
          },
          {
            label: "Follow others' choices blindly.",
            outcome: "Dissatisfaction appears later."
          }
        ],
        reflections: [
          "What fears affect your decisions?",
          "How can exploration reduce anxiety?"
        ],
        skill: "Decision confidence awareness"
      },
    },
    {
      id: "brain-young-adult-18",
      title: "After a Mistake",
      description:
        "A mistake occurs in an important task, learning to manage the fear of consequences and choose a healthy response.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-18"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/after-a-mistake",
      index: 17,
      scenario: {
        setup:
          "A mistake occurs in an important task.",
        choices: [
          {
            label: "Hide the mistake.",
            outcome: "Stress increases."
          },
          {
            label: "Acknowledge and learn.",
            outcome: "Confidence rebuilds."
          },
          {
            label: "Blame external factors.",
            outcome: "Learning reduces."
          }
        ],
        reflections: [
          "How do you react to mistakes?",
          "What helps you move forward?"
        ],
        skill: "Failure response awareness"
      },
    },
    {
      id: "brain-young-adult-19",
      title: "Fear of Falling Behind",
      description:
        "Peers seem to progress faster, learning to manage the fear of lagging behind and choose a healthy response.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-19"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/fear-of-falling-behind",
      index: 18,
      scenario: {
        setup:
          "Peers seem to progress faster.",
        choices: [
          {
            label: "Rush decisions.",
            outcome: "Stress increases."
          },
          {
            label: "Focus on personal pace.",
            outcome: "Stability improves."
          },
          {
            label: "Withdraw from comparison.",
            outcome: "Perspective improves."
          }
        ],
        reflections: [
          "How does comparison affect you?",
          "What pace feels sustainable?"
        ],
        skill: "Self-paced growth awareness"
      },
    },
    {
      id: "brain-young-adult-20",
      title: "Facing the Outcome",
      description:
        "An outcome does not match expectations, learning to manage disappointment and fear of future failure.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-20"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/facing-the-outcome",
      index: 19,
      scenario: {
        setup:
          "An outcome does not match expectations.",
        choices: [
          {
            label: "Self-criticise harshly.",
            outcome: "Confidence drops."
          },
          {
            label: "Reflect and adjust expectations.",
            outcome: "Resilience increases."
          },
          {
            label: "Avoid future attempts.",
            outcome: "Opportunities reduce."
          }
        ],
        reflections: [
          "How do outcomes affect your self-view?",
          "What helps you recover?"
        ],
        skill: "Resilience awareness"
      },
    },
    {
      id: "brain-young-adult-21",
      title: "Sudden Irritation",
      description:
        "A young adult feels irritated during a normal conversation without knowing why, learning to manage sudden emotional reactions.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-21"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/sudden-irritation",
      index: 20,
      scenario: {
        setup:
          "A young adult feels irritated during a normal conversation without knowing why.",
        choices: [
          {
            label: "React immediately with frustration.",
            outcome: "Conflict increases."
          },
          {
            label: "Pause and notice the emotion.",
            outcome: "Awareness improves."
          },
          {
            label: "Suppress the feeling.",
            outcome: "Emotion resurfaces later."
          }
        ],
        reflections: [
          "What usually triggers irritation?",
          "How do you notice emotions early?"
        ],
        skill: "Emotional awareness"
      },
    },
    {
      id: "brain-young-adult-22",
      title: "Mixed Emotions",
      description:
        "A young adult feels happy and anxious at the same time about an opportunity, learning to manage conflicting emotions.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-22"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/mixed-emotions",
      index: 21,
      scenario: {
        setup:
          "A young adult feels happy and anxious at the same time about an opportunity.",
        choices: [
          {
            label: "Ignore uncomfortable feelings.",
            outcome: "Confusion remains."
          },
          {
            label: "Acknowledge both emotions.",
            outcome: "Clarity improves."
          },
          {
            label: "Focus only on anxiety.",
            outcome: "Stress increases."
          }
        ],
        reflections: [
          "What emotions often appear together?",
          "How does acknowledging emotions help?"
        ],
        skill: "Emotional clarity"
      },
    },
    {
      id: "brain-young-adult-23",
      title: "Emotional Build-Up",
      description:
        "Emotions build up after several stressful days, learning to manage emotional accumulation.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-23"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/emotional-build-up",
      index: 22,
      scenario: {
        setup:
          "Emotions build up after several stressful days.",
        choices: [
          {
            label: "Release emotions suddenly.",
            outcome: "Relief followed by guilt."
          },
          {
            label: "Address emotions gradually.",
            outcome: "Balance improves."
          },
          {
            label: "Ignore emotions.",
            outcome: "Emotional overload occurs later."
          }
        ],
        reflections: [
          "How do emotions build up for you?",
          "What helps release emotions safely?"
        ],
        skill: "Emotional regulation awareness"
      },
    },
    {
      id: "brain-young-adult-24",
      title: "Feeling Numb",
      description:
        "A young adult feels emotionally disconnected after prolonged stress, learning to manage emotional disconnection.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-24"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/feeling-numb",
      index: 23,
      scenario: {
        setup:
          "A young adult feels emotionally disconnected after prolonged stress.",
        choices: [
          {
            label: "Ignore the numbness.",
            outcome: "Disconnection continues."
          },
          {
            label: "Notice and reflect on it.",
            outcome: "Awareness increases."
          },
          {
            label: "Force emotional reactions.",
            outcome: "Frustration increases."
          }
        ],
        reflections: [
          "When do you feel emotionally distant?",
          "What helps reconnect emotionally?"
        ],
        skill: "Emotional sensitivity awareness"
      },
    },
    {
      id: "brain-young-adult-25",
      title: "Anger Trigger",
      description:
        "A small event triggers unexpected anger, learning to manage anger responses effectively.",
      icon: <Brain className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["brain-young-adult-25"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/brain-health/young-adult/anger-trigger",
      index: 24,
      scenario: {
        setup:
          "A small event triggers unexpected anger.",
        choices: [
          {
            label: "Express anger immediately.",
            outcome: "Conflict increases."
          },
          {
            label: "Pause and reflect.",
            outcome: "Control improves."
          },
          {
            label: "Suppress anger.",
            outcome: "Anger resurfaces later."
          }
        ],
        reflections: [
          "What triggers anger for you?",
          "How do you usually respond?"
        ],
        skill: "Anger awareness"
      },
    },
  ];

  return brainYoungAdultGames;
};
