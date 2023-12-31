const cron = require("node-cron");
const db = require("./db_manager");

// // Your long-running process function
// async function longRunningProcess() {
//   // ... implementation of your long-running process
//   console.log("Long-running process initiated");
//   // This is where you would perform the actual work that takes a few hours
// }

// // Schedule the cron job to run every day at 12 noon
// const cronExpression = "0 12 * * *"; // This expression means 'every day at 12:00 PM'
// cron.schedule(cronExpression, () => {
//   longRunningProcess();
// });

console.log(`Cron job scheduled to run every day at 12:00 PM`);
