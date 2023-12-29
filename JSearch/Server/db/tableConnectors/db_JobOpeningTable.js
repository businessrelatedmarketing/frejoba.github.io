/////////// Create JobOpenings Table //////////
function createJobOpeningsTable(dynamodb) {
  // Define table parameters
  const tableParams = {
    TableName: "JobOpenings",
    KeySchema: [
      { AttributeName: "CompanyName", KeyType: "HASH" }, // Partition key
      { AttributeName: "JobURL", KeyType: "RANGE" }, // Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "CompanyName", AttributeType: "S" },
      { AttributeName: "JobURL", AttributeType: "S" }, // or 'N' for Number
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5, // adjust based on your read requirements
      WriteCapacityUnits: 5, // adjust based on your write requirements
    },
  };

  // Create table
  dynamodb.createTable(tableParams, (err, data) => {
    if (err) {
      console.error("AWS DynamoDB JO Table Client: Error creating table:", err.message);
    } else {
      console.log("AWS DynamoDB JO Table Client: Table created successfully");
    }
  });
}

// let jobOpening = {
//   CompanyName: CompanyName, // Bare minimum
//   Title: Title,  // Bare minimum
//   JobURL: JobURL,  // Bare minimum
//   Description: Description,  // Bare minimum
//   CompanyLogo: CompanyLogo,
//   Location: location,  // Bare minimum
//   DatePostedOn: DatePostedOn,  // Bare minimum
//   Source: Source,  // Bare minimum
//   JobType: JobType,
//   LocationType: LocationType,
//   ExperienceLevel: ExperienceLevel,
//   AgoTime: Agotime,
// };
/////////// Insert Into JobOpenings Table //////////
function insertIntoJobOpeningsTable(docClient, jobOpening) {
  const putParams = {
    TableName: "JobOpenings",
    Item: jobOpening,
  };

  // Put the item into the table
  docClient.put(putParams, (err, data) => {
    if (err) {
      console.error("AWS DynamoDB JO Table Client: Error putting item:", err.message);
    } else {
      console.log("AWS DynamoDB JO Table Client: Item added successfully");
    }
  });
}

/////////// Query JobOpenings Table ////////
async function queryJobOpeningTable(docClient, params, limit) {
  const tableName = "JobOpenings";

  // Build the KeyConditionExpression based on the provided parameters
  const keyConditionExpression = [];
  const expressionAttributeValues = {};

  if (params?.company !== "") {
    keyConditionExpression.push("CompanyName = :companyName");
    expressionAttributeValues[":companyName"] = params.company;
  }

  if (params?.dateSincePosted !== "") {
    keyConditionExpression.push("DatePostedOn = :datePosted");
    expressionAttributeValues[":datePosted"] = params.dateSincePosted;
  }

  if (params?.jobType !== "") {
    keyConditionExpression.push("JobType = :jobType");
    expressionAttributeValues[":jobType"] = params.jobType;
  }

  if (params?.remoteFilter !== "") {
    keyConditionExpression.push("remoteFilter = :remoteFilter");
    expressionAttributeValues[":remoteFilter"] = params.remoteFilter;
  }

  if (params?.experienceLevel !== "") {
    keyConditionExpression.push("ExperienceLevel = :experienceLevel");
    expressionAttributeValues[":experienceLevel"] = params.experienceLevel;
  }

  // Construct the final query parameters
  const queryParams = {
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression.join(" AND "),
    ExpressionAttributeValues: expressionAttributeValues,
    Limit: limit,
  };

  try {
    // Query the table
    const result = await docClient.query(queryParams).promise();

    // Log the result or process it as needed
    console.log("AWS DynamoDB JO Table Client: Query result Successful!");

    return result.Items;
  } catch (error) {
    console.error("AWS DynamoDB JO Table Client: Error querying table:", error.message);
    throw error;
  }
}

module.exports = {
  createJobOpeningsTable,
  insertIntoJobOpeningsTable,
  queryJobOpeningTable,
};
