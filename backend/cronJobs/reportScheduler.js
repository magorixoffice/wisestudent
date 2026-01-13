import cron from "node-cron";
import Report from "../models/Report.js";
import User from "../models/User.js";

const generateWeeklyReports = async () => {
  try {
    const students = await User.find({ role: "student" });

    for (const student of students) {
      const newReport = await Report.create({
        userId: student._id,
        reportType: "weekly",
        data: {
          message: `Generated auto-report for ${
            student.name
          } at ${new Date().toLocaleString()}`,
          // Add analytics data if needed
        },
      });

    }
  } catch (err) {
    console.error("❌ Failed to generate reports:", err.message);
  }
};

// Schedule every Monday at 8:00 AM
export const scheduleWeeklyReports = () => {
  cron.schedule("0 8 * * 1", async () => {
    await generateWeeklyReports();
  });
};
