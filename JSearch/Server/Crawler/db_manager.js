const AWS = require("aws-sdk");
require("dotenv").config();

// Configure AWS SDK (Make sure you have your AWS credentials set up)
AWS.config.update({
  region: process.env.Region, // replace with your AWS region
  accessKeyId: process.env.AccesKeyId,
  secretAccessKey: process.env.SecretAccessKey,
});

const docClient = new AWS.DynamoDB.DocumentClient();

async function bulkInsert(tableName, data) {
  // Define the batch size
  // Max allowed batch size by DynamoDB
  const batchSize = 25;

  // Calculate the number of batches
  const numBatches = Math.ceil(data.length / batchSize);

  // Process each batch
  for (let i = 0; i < numBatches; i++) {
    // Calculate the start and end indices for the current batch
    const startIdx = i * batchSize;
    const endIdx = Math.min((i + 1) * batchSize, data.length);

    // Extract the current batch of job openings
    const currentBatch = data.slice(startIdx, endIdx);

    // Prepare the batch write parameters
    const params = {
      RequestItems: {
        [tableName]: currentBatch.map((jobOpening) => ({
          PutRequest: {
            Item: jobOpening,
          },
        })),
      },
    };

    try {
      // Execute the batch write operation
      const result = await docClient.batchWrite(params).promise();
      console.log("Batch insert successful:", result);
    } catch (error) {
      console.error("Error performing batch insert:", error);
      throw error;
    }
  }
}

// // Example usage:
// const jobOpeningsToInsert = [
//   // ... array of job opening objects
//   {
//     CompanyName: "amazon", // Bare minimum
//     Title: "Data Engineer", // Bare minimum
//     JobURL:
//       "https://jobs.careers.microsoft.com/global/en/job/1671343/Data-Engineer-II", // Bare minimum
//     Description: "Description Dummy", // Bare minimum
//     Location: "Hyderabad, Telangana, India", // Bare minimum
//     DatePostedOn: "20-12-13", // Bare minimum
//     Source: "Career Page", // Bare minimum
//     JobType: "Full Time",
//     remoteFilter: "",
//     LocationType: "on-site",
//     ExperienceLevel: "entry",
//     AgoTime: "1 week ago",
//   },
//   {
//     CompanyName: "google", // Bare minimum
//     Title: "Data Engineer", // Bare minimum
//     JobURL:
//       "https://jobs.careers.microsoft.com/global/en/job/1671343/Data-Engineer-II", // Bare minimum
//     Description: "Description Dummy", // Bare minimum
//     Location: "Hyderabad, Telangana, India", // Bare minimum
//     DatePostedOn: "20-12-13", // Bare minimum
//     Source: "Career Page", // Bare minimum
//     JobType: "Full Time",
//     remoteFilter: "",
//     LocationType: "on-site",
//     ExperienceLevel: "entry",
//     AgoTime: "1 week ago",
//   },
//   {
//     CompanyName: "walmart", // Bare minimum
//     Title: "Data Engineer", // Bare minimum
//     JobURL:
//       "https://jobs.careers.microsoft.com/global/en/job/1671343/Data-Engineer-II", // Bare minimum
//     Description: "Description Dummy", // Bare minimum
//     Location: "Hyderabad, Telangana, India", // Bare minimum
//     DatePostedOn: "20-12-13", // Bare minimum
//     Source: "Career Page", // Bare minimum
//     JobType: "Full Time",
//     remoteFilter: "",
//     LocationType: "on-site",
//     ExperienceLevel: "entry",
//     AgoTime: "1 week ago",
//   },
//   {
//     CompanyName: "arcesium", // Bare minimum
//     Title: "Data Engineer", // Bare minimum
//     JobURL:
//       "https://jobs.careers.microsoft.com/global/en/job/1671343/Data-Engineer-II", // Bare minimum
//     Description: "Description Dummy", // Bare minimum
//     Location: "Hyderabad, Telangana, India", // Bare minimum
//     DatePostedOn: "20-12-13", // Bare minimum
//     Source: "Career Page", // Bare minimum
//     JobType: "Full Time",
//     remoteFilter: "",
//     LocationType: "on-site",
//     ExperienceLevel: "entry",
//     AgoTime: "1 week ago",
//   },
// ];

// bulkInsert(process.env.JobOpeningTable, jobOpeningsToInsert)
//   .then(() => console.log("Bulk insert complete"))
//   .catch((error) => console.error("Error:", error));