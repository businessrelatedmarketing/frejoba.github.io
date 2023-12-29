const AWS = require("aws-sdk");
require("dotenv").config();
const {
  createJobOpeningsTable,
  insertIntoJobOpeningsTable,
  queryJobOpeningTable,
} = require("./tableConnectors/db_JobOpeningTable");

const {
  createCDLTable,
  insertIntoCDLTable,
  queryCDLTable,
} = require("./tableConnectors/db_CompanyDiscussionLinksTable");

// Configure AWS SDK (Make sure you have your AWS credentials set up)
AWS.config.update({
  region: process.env.Region, // replace with your AWS region
  accessKeyId: process.env.AccesKeyId,
  secretAccessKey: process.env.SecretAccessKey,
});

// Create DynamoDB clients
const docClient = new AWS.DynamoDB.DocumentClient();

// Only needed while creating table
// const dynamodb = new AWS.DynamoDB();
// createJobOpeningsTable(dynamodb);
// createCDLTable(dynamodb);

// let jobOpening = {
//   CompanyName: "microsoft", // Bare minimum
//   Title: "Data Engineer", // Bare minimum
//   JobURL:
//     "https://jobs.careers.microsoft.com/global/en/job/1671343/Data-Engineer-II", // Bare minimum
//   Description: "Description Dummy", // Bare minimum
//   Location: "Hyderabad, Telangana, India", // Bare minimum
//   DatePostedOn: "20-12-13", // Bare minimum
//   Source: "Career Page", // Bare minimum
//   JobType: "Full Time",
//   remoteFilter: "",
//   LocationType: "on-site",
//   ExperienceLevel: "entry",
//   AgoTime: "1 week ago",
// };

// insertIntoJobOpeningsTable(docClient, jobOpening);

let discussionLink = {
  CompanyName: "microsoft", // Bare minimum
  DiscussionLink:
    "https://leetcode.com/discuss/compensation/4322574/Microsoft-or-L62-or-Bangalore", // Bare minimum
  Type: "salary", // ,"Culture", "Work Life Balance", "Perks"
};

insertIntoCDLTable(docClient, discussionLink);

module.exports = {
  docClient,
  queryJobOpeningTable,
  queryCDLTable,
};
