import { Wallet } from "lucide-react";
import buildIds from "../buildGameIds";

export const financegGameIdsYoungAdult = buildIds("finance", "young-adult");

export const getFinanceYoungAdultGames = (gameCompletionStatus) => {
  const financeYoungAdultGames = [
    {
      id: "finance-young-adult-1",
      title: "First Income Reality",
      description:
        "You receive your first stipend or salary—what does this income represent for you?",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-1"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/first-income-reality",
      index: 0,
      scenario: {
        setup:
          "You receive your first stipend or salary. It feels exciting, but you also wonder what this income truly means.",
        choices: [
          {
            label: "Free money to spend however you like",
            outcome:
              "Spending it without a plan gives a momentary high, but you soon run out of fuel for your responsibilities.",
          },
          {
            label: "A responsibility to manage wisely",
            outcome:
              "This income opens the door to freedom, provided you plan for needs, savings, and growth.",
          },
        ],
        reflections: [
          "How can you balance freedom and responsibility when money arrives for the first time?",
          "Which immediate priorities should you handle before splurging?",
        ],
        skill: "Responsible income mindset",
      },
    },
    {
      id: "finance-young-adult-2",
      title: "Salary Is Not Pocket Money",
      description:
        "How should first income be treated? Learn the difference between earned money and casual spending.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-2"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/salary-is-not-pocket-money",
      index: 1,
      scenario: {
        setup:
          "You've earned your first income through work. The key question is: how should you treat this differently from pocket money?",
        choices: [
          {
            label: "Like pocket money",
            outcome:
              "Treating earned income like pocket money leads to fast depletion and poor financial habits.",
          },
          {
            label: "Like earned money with limits",
            outcome:
              "Recognizing income as earned through effort helps establish responsible spending boundaries.",
          },
        ],
        reflections: [
          "How can you maintain the distinction between earned income and casual spending?",
          "What systems can you put in place to prevent salary from becoming pocket money?",
        ],
        skill: "Earned income mindset",
      },
    },
    {
      id: "finance-young-adult-3",
      title: "Lifestyle Upgrade Temptation",
      description:
        "After first income, what is the safest approach to lifestyle improvements? Learn to balance rewards with responsibility.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-3"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/lifestyle-upgrade-temptation",
      index: 2,
      scenario: {
        setup:
          "You've received your first income and feel tempted to upgrade your lifestyle. The challenge is finding the balance between enjoying your earnings and maintaining financial stability.",
        choices: [
          {
            label: "Upgrade lifestyle immediately",
            outcome:
              "Sudden lifestyle upgrades can create financial stress and unrealistic expectations for future income.",
          },
          {
            label: "Increase spending slowly and carefully",
            outcome:
              "Gradual improvements ensure financial stability while still allowing you to enjoy your increased earning power.",
          },
        ],
        reflections: [
          "How can you enjoy lifestyle improvements while maintaining financial stability?",
          "What criteria should guide your spending decisions with increased income?",
        ],
        skill: "Balanced lifestyle progression",
      },
    },
    {
      id: "finance-young-adult-4",
      title: "First Month Spending Plan",
      description:
        "What should you do before spending your income? Learn essential planning strategies for your financial success.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-4"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/first-month-spending-plan",
      index: 3,
      scenario: {
        setup:
          "You're about to receive your first income and need to decide how to approach your spending. The key is establishing good habits from day one.",
        choices: [
          {
            label: "Spend first, plan later",
            outcome:
              "Planning prevents regret and ensures your income covers necessities while building financial security.",
          },
          {
            label: "List expenses and savings first",
            outcome:
              "Strategic planning before spending creates a foundation for long-term financial success and peace of mind.",
          },
        ],
        reflections: [
          "How can planning prevent financial regrets in your first month?",
          "What balance between saving and spending feels sustainable for you?",
        ],
        skill: "Strategic financial planning",
      },
    },
    {
      id: "finance-young-adult-5",
      title: "Income vs Fixed Commitments",
      description:
        "Which expense should be prioritised? Learn to distinguish between essential commitments and lifestyle choices.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-5"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/income-vs-fixed-commitments",
      index: 4,
      scenario: {
        setup:
          "You have limited income and must choose between fixed commitments and lifestyle expenses. The key is understanding which expenses are non-negotiable.",
        choices: [
          {
            label: "Subscriptions and entertainment",
            outcome:
              "Fixed needs like rent, food, and transportation come before lifestyle choices to maintain financial stability.",
          },
          {
            label: "Rent, travel, food, essentials",
            outcome:
              "Prioritizing fixed commitments ensures your basic needs are met and prevents serious financial consequences.",
          },
        ],
        reflections: [
          "How can you ensure fixed commitments are always covered?",
          "What's the relationship between financial stability and lifestyle choices?",
        ],
        skill: "Priority-based budgeting",
      },
    },
    {
      id: "finance-young-adult-6",
      title: "Saving from First Income",
      description:
        "Is saving from first income important? Learn why early saving builds long-term financial discipline and opportunities.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-6"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/saving-from-first-income",
      index: 5,
      scenario: {
        setup:
          "You've received your first income and must decide whether to start saving immediately or wait for better circumstances. The choice shapes your financial future.",
        choices: [
          {
            label: "No, savings can wait",
            outcome:
              "Early saving builds long-term discipline and takes advantage of compound interest to create substantial wealth over time.",
          },
          {
            label: "Yes, habits start early",
            outcome:
              "Starting to save from your first income establishes lifelong financial discipline and maximizes the power of compound growth.",
          },
        ],
        reflections: [
          "How can early saving create opportunities you can't imagine today?",
          "What small saving habit could you start immediately with your next income?",
        ],
        skill: "Early saving discipline",
      },
    },
    {
      id: "finance-young-adult-7",
      title: "Peer Comparison Trap",
      description:
        "Friends spend more than you. Learn to make financial decisions based on your goals rather than social pressure.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-7"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/peer-comparison-trap",
      index: 6,
      scenario: {
        setup:
          "Your friends seem to spend more freely than you do. The challenge is distinguishing between genuine needs and social pressure to match their lifestyle.",
        choices: [
          {
            label: "Their lifestyle",
            outcome:
              "Comparing lifestyles causes overspending and financial stress when you try to match others' spending patterns.",
          },
          {
            label: "Your income and goals",
            outcome:
              "Making decisions based on your personal financial situation and long-term goals creates sustainable wealth and authentic relationships.",
          },
        ],
        reflections: [
          "How can you maintain friendships while staying true to your financial values?",
          "What personal goals are worth prioritizing over social spending pressure?",
        ],
        skill: "Social financial independence",
      },
    },
    {
      id: "finance-young-adult-8",
      title: "First Income Mistake",
      description:
        "You overspent this month. What's the best response? Learn how to turn financial mistakes into growth opportunities.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-8"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/first-income-mistake",
      index: 7,
      scenario: {
        setup:
          "You've realized you overspent this month and need to decide how to respond. The key is learning from mistakes without letting them define your financial future.",
        choices: [
          {
            label: "Ignore it",
            outcome:
              "Learning early prevents repeated mistakes and builds the financial wisdom needed for long-term success.",
          },
          {
            label: "Review and adjust next month",
            outcome:
              "Acknowledging mistakes and making adjustments creates opportunities for growth and prevents future financial setbacks.",
          },
        ],
        reflections: [
          "How can financial mistakes become stepping stones to better money management?",
          "What systems can you put in place to learn from errors without repeating them?",
        ],
        skill: "Financial mistake recovery",
      },
    },
    {
      id: "finance-young-adult-9",
      title: "Income Growth vs Discipline",
      description:
        "What matters more early on? Learn how discipline protects your income at all levels.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-9"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/income-growth-vs-discipline",
      index: 8,
      scenario: {
        setup:
          "You're considering whether to focus on growing your income or developing financial discipline. The key is understanding how these two factors work together for long-term success.",
        choices: [
          {
            label: "Income growth alone",
            outcome:
              "Discipline protects income at all levels and is essential for building lasting financial security.",
          },
          {
            label: "Discipline + income growth",
            outcome:
              "Combining discipline with income growth creates the strongest foundation for long-term financial success.",
          },
        ],
        reflections: [
          "How can you maintain discipline while pursuing income growth?",
          "What balance between spending and saving feels sustainable for your situation?",
        ],
        skill: "Income discipline balance",
      },
    },
    {
      id: "finance-young-adult-10",
      title: "Independence Checkpoint",
      description:
        "Make 7 responsible decisions about first income. Are you ready to manage money independently?",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-10"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/independence-checkpoint",
      index: 9,
      scenario: {
        setup:
          "You've reached a milestone in your financial journey. Now you need to demonstrate 7 key principles of independent money management to prove you're ready to handle finances on your own.",
        choices: [
          {
            label: "Make responsible financial decisions",
            outcome:
              "You are now ready to manage money independently.",
          },
          {
            label: "Continue learning with guidance",
            outcome:
              "Building financial independence requires mastering key decision-making principles.",
          },
        ],
        reflections: [
          "How can you maintain financial independence while building meaningful relationships?",
          "What systems can you create to ensure consistent financial responsibility?",
        ],
        skill: "Independent money management",
      },
    },
    {
      id: "finance-young-adult-11",
      title: "Wants Disguised as Needs",
      description:
        "Which is a want, not a need? Learn to identify wants that often look urgent but can wait.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-11"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/wants-disguised-as-needs",
      index: 10,
      scenario: {
        setup:
          "Distinguishing between wants and needs can be challenging, especially when wants are disguised as needs. This game helps you identify the difference and make better financial decisions.",
        choices: [
          {
            label: "Daily meals",
            outcome:
              "Wants often look urgent but can wait.",
          },
          {
            label: "Upgrading phone every year",
            outcome:
              "Understanding the difference between wants and needs helps you make more thoughtful spending decisions.",
          },
        ],
        reflections: [
          "How can you identify when a want is disguised as a need?",
          "What strategies help you prioritize needs over wants in your budget?",
        ],
        skill: "Wants vs needs recognition",
      },
    },
    {
      id: "finance-young-adult-12",
      title: "Subscription Trap",
      description:
        "You have multiple subscriptions you barely use. Learn to identify and cancel unused ones.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-12"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/subscription-trap",
      index: 11,
      scenario: {
        setup:
          "Managing subscriptions can be tricky, especially when they seem cheap individually but add up over time. This game helps you identify the trap of accumulating unused subscriptions that silently drain your money.",
        choices: [
          {
            label: "Keep them all",
            outcome:
              "Small monthly costs silently drain money.",
          },
          {
            label: "Cancel unused ones",
            outcome:
              "Understanding the subscription trap helps you retain more of your hard-earned money.",
          },
        ],
        reflections: [
          "How can you identify subscriptions you're not using regularly?",
          "What systems can you implement to prevent accumulating unused subscriptions?",
        ],
        skill: "Subscription management",
      },
    },
    {
      id: "finance-young-adult-13",
      title: "Weekend Spending Reality",
      description:
        "Frequent weekend outings lead to budget imbalance over time. Learn how repeated small spends add up.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-13"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/weekend-spending-reality",
      index: 12,
      scenario: {
        setup:
          "Weekend activities can be enjoyable but may impact your finances more than expected. This game explores how frequent small weekend expenses accumulate over time.",
        choices: [
          {
            label: "No impact",
            outcome:
              "Repeated small spends add up.",
          },
          {
            label: "Budget imbalance over time",
            outcome:
              "Understanding weekend spending patterns helps maintain financial balance.",
          },
        ],
        reflections: [
          "How can you enjoy weekends while maintaining financial balance?",
          "What strategies help you plan weekend activities within your budget?",
        ],
        skill: "Weekend spending awareness",
      },
    },
    {
      id: "finance-young-adult-14",
      title: "Brand vs Budget",
      description:
        "Learn which choice is financially wiser between buying brands to impress versus buying within budget and need.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-14"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/brand-vs-budget",
      index: 13,
      scenario: {
        setup:
          "Managing the pressure between brand appeal and budget consciousness is a common financial challenge. This game explores how to make wise purchasing decisions.",
        choices: [
          {
            label: "Buying brands to impress",
            outcome:
              "Brand pressure causes unnecessary expense.",
          },
          {
            label: "Buying within budget and need",
            outcome:
              "Understanding the value of budget-conscious purchases helps maintain financial health.",
          },
        ],
        reflections: [
          "How can you resist brand pressure while making smart purchases?",
          "What strategies help you evaluate value vs. brand appeal?",
        ],
        skill: "Brand vs budget awareness",
      },
    },
    {
      id: "finance-young-adult-15",
      title: "Sale Psychology",
      description:
        "Learn to navigate sales and discounts wisely by focusing on actual needs rather than the attraction of a deal.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-15"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/sale-psychology",
      index: 14,
      scenario: {
        setup:
          "Sales and discounts can create psychological pressure to buy items we didn't plan for. This game explores how to make wise decisions when faced with attractive deals.",
        choices: [
          {
            label: "Is it cheap?",
            outcome:
              "Discounts don't justify unnecessary purchases.",
          },
          {
            label: "Do I actually need it?",
            outcome:
              "Understanding the importance of need vs. want helps make better purchasing decisions.",
          },
        ],
        reflections: [
          "How can you resist the psychological pull of sales and discounts?",
          "What strategies help you distinguish between genuine needs and tempting deals?",
        ],
        skill: "Sale psychology awareness",
      },
    },
    {
      id: "finance-young-adult-16",
      title: "Lifestyle Inflation",
      description:
        "Learn how to handle income increases wisely by prioritizing savings over spending to avoid lifestyle inflation.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-16"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/lifestyle-inflation",
      index: 15,
      scenario: {
        setup:
          "As income increases, many people fall into the trap of increasing their spending proportionally. This game explores how to handle income growth wisely.",
        choices: [
          {
            label: "Spending immediately",
            outcome:
              "Lifestyle inflation traps young earners.",
          },
          {
            label: "Savings and goals first",
            outcome:
              "Prioritizing savings when income increases helps build long-term financial security.",
          },
        ],
        reflections: [
          "How can you enjoy income increases while preventing lifestyle inflation?",
          "What systems can you put in place to automatically save a portion of income increases?",
        ],
        skill: "Lifestyle inflation awareness",
      },
    },
    {
      id: "finance-young-adult-17",
      title: "Borrowing to Spend",
      description:
        "Learn about the risks of borrowing for lifestyle spending and how it affects your financial independence.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-17"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/borrowing-to-spend",
      index: 16,
      scenario: {
        setup:
          "Borrowing for lifestyle spending is a common temptation that can have long-term consequences. This game explores the impact of lifestyle debt.",
        choices: [
          {
            label: "Yes",
            outcome:
              "Lifestyle loans delay financial independence.",
          },
          {
            label: "No, it creates long-term stress",
            outcome:
              "Understanding the risks of borrowing for lifestyle spending helps maintain financial health.",
          },
        ],
        reflections: [
          "How can you enjoy lifestyle improvements while maintaining financial health?",
          "What strategies help you avoid borrowing for lifestyle spending?",
        ],
        skill: "Debt-free spending awareness",
      },
    },
    {
      id: "finance-young-adult-18",
      title: "Peer Pressure Purchase",
      description:
        "Learn how to handle peer pressure when friends encourage spending beyond your comfort zone.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-18"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/peer-pressure-purchase",
      index: 17,
      scenario: {
        setup:
          "Handling peer pressure in spending situations is a critical financial skill. This game explores how to maintain financial control while preserving friendships.",
        choices: [
          {
            label: "Follow them",
            outcome:
              "Financial confidence includes saying no.",
          },
          {
            label: "Stick to your limits",
            outcome:
              "Maintaining your financial boundaries helps preserve both your finances and self-respect.",
          },
        ],
        reflections: [
          "How can you maintain friendships while staying within your financial limits?",
          "What strategies help you confidently say no to spending that doesn't align with your goals?",
        ],
        skill: "Peer pressure resistance",
      },
    },
    {
      id: "finance-young-adult-19",
      title: "Tracking Lifestyle Costs",
      description:
        "Learn why tracking lifestyle expenses is important to avoid overspending unknowingly.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-19"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/tracking-lifestyle-costs",
      index: 18,
      scenario: {
        setup:
          "Tracking lifestyle expenses is crucial for maintaining financial awareness. This game explores the importance of monitoring spending patterns.",
        choices: [
          {
            label: "To restrict fun",
            outcome:
              "Awareness prevents regret.",
          },
          {
            label: "To avoid overspending unknowingly",
            outcome:
              "Understanding your spending patterns helps maintain financial control.",
          },
        ],
        reflections: [
          "How can tracking expenses help you maintain your desired lifestyle while staying within budget?",
          "What tools or methods work best for consistently tracking lifestyle expenses?",
        ],
        skill: "Expense tracking awareness",
      },
    },
    {
      id: "finance-young-adult-20",
      title: "Smart Spending Checkpoint",
      description:
        "Make 7 smart spending decisions to master the art of enjoying life without harming your finances.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Hard",
      duration: "8 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-20"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/smart-spending-checkpoint",
      index: 19,
      scenario: {
        setup:
          "This checkpoint challenges you to make 7 smart spending decisions that demonstrate your financial wisdom and discipline.",
        choices: [
          {
            label: "Make responsible spending choices",
            outcome:
              "You can now enjoy life without harming your finances.",
          },
          {
            label: "Continue learning about financial discipline",
            outcome:
              "Mastering smart spending habits is key to financial freedom.",
          },
        ],
        reflections: [
          "How can you maintain financial discipline while still enjoying life experiences?",
          "What strategies help you make smart spending decisions consistently?",
        ],
        skill: "Smart spending mastery",
      },
    },
    {
      id: "finance-young-adult-21",
      title: "Why Budgeting Matters",
      description:
        "Learn how budgeting helps you control money instead of guessing where it goes.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-21"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/why-budgeting-matters",
      index: 20,
      scenario: {
        setup:
          "Understanding the importance of budgeting is crucial for financial success. This game explores how budgets provide financial control and freedom.",
        choices: [
          {
            label: "Restrict all spending",
            outcome:
              "Budgets give freedom with limits.",
          },
          {
            label: "Control money instead of guessing",
            outcome:
              "Budgeting helps you make intentional financial decisions.",
          },
        ],
        reflections: [
          "How can budgeting help you achieve your financial goals while still allowing for flexibility?",
          "What strategies help maintain a budget that adapts to changing needs?",
        ],
        skill: "Budgeting fundamentals",
      },
    },
    {
      id: "finance-young-adult-22",
      title: "Fixed vs Variable Expenses",
      description:
        "Learn to distinguish between fixed expenses that must be planned first and variable expenses that can be adjusted.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-22"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/fixed-vs-variable-expenses",
      index: 21,
      scenario: {
        setup:
          "Understanding the difference between fixed and variable expenses is crucial for effective budgeting. This game explores how to prioritize different types of expenses.",
        choices: [
          {
            label: "Rent/hostel fee",
            outcome:
              "Fixed expenses must be planned first.",
          },
          {
            label: "Eating out",
            outcome:
              "Variable expenses can be adjusted based on your budget and priorities.",
          },
        ],
        reflections: [
          "How can you ensure fixed expenses are always covered in your budget?",
          "What strategies help manage variable expenses within your financial limits?",
        ],
        skill: "Expense categorization",
      },
    },
    {
      id: "finance-young-adult-23",
      title: "Monthly Budget Order",
      description:
        "Learn the correct order for budgeting: essentials and savings first, then wants.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-23"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/monthly-budget-order",
      index: 22,
      scenario: {
        setup:
          "Proper budget order is crucial for financial stability. This game explores the importance of prioritizing expenses in the right sequence.",
        choices: [
          {
            label: "Entertainment",
            outcome:
              "Priorities protect stability.",
          },
          {
            label: "Essentials and savings",
            outcome:
              "Prioritizing essentials and savings creates a strong financial foundation.",
          },
        ],
        reflections: [
          "How can you ensure essentials and savings are always prioritized in your budget?",
          "What strategies help maintain proper budget order even when facing financial pressures?",
        ],
        skill: "Budget prioritization",
      },
    },
    {
      id: "finance-young-adult-24",
      title: "Ignoring Small Expenses",
      description:
        "Understand how small daily expenses accumulate and impact your overall budget.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-24"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/ignoring-small-expenses",
      index: 23,
      scenario: {
        setup:
          "Small daily expenses may seem insignificant, but they accumulate quickly over time. This game explores the impact of ignoring these seemingly minor expenditures.",
        choices: [
          {
            label: "Don't matter",
            outcome:
              "Small leaks sink budgets.",
          },
          {
            label: "Add up over the month",
            outcome:
              "Small expenses accumulate significantly when tracked over time.",
          },
        ],
        reflections: [
          "How can you track small daily expenses without making budgeting overly burdensome?",
          "What strategies help maintain awareness of small expenses while still enjoying life?",
        ],
        skill: "Expense tracking awareness",
      },
    },
    {
      id: "finance-young-adult-25",
      title: "Budget vs Reality",
      description:
        "Learn how to handle budgeting setbacks and develop resilience in financial planning.",
      icon: <Wallet className="w-6 h-6" />,
      difficulty: "Medium",
      duration: "6 min",
      coins: 5,
      xp: 10,
      completed: gameCompletionStatus["finance-young-adult-25"] || false,
      isSpecial: true,
      reflective: true,
      path: "/student/finance/young-adult/budget-vs-reality",
      index: 24,
      scenario: {
        setup:
          "Budgeting doesn't always go according to plan, especially when starting out. This game explores how to handle budgeting setbacks and develop resilience in financial planning.",
        choices: [
          {
            label: "Quit budgeting",
            outcome:
              "Budgeting improves with practice.",
          },
          {
            label: "Adjust and try again next month",
            outcome:
              "Adjusting your approach based on experience leads to better financial habits.",
          },
        ],
        reflections: [
          "How can you build flexibility into your budget while still maintaining financial discipline?",
          "What strategies help maintain motivation when budgeting doesn't go as planned initially?",
        ],
        skill: "Resilient budgeting",
      },
    },
  ];

  return financeYoungAdultGames;
};
