/////////// Create CompanyDiscussionsLinks Table //////////
function createCDLTable(dynamodb) {
  // Define table parameters
  const tableParams = {
    TableName: "CompanyDiscussionsLinks",
    KeySchema: [
      { AttributeName: "CompanyName", KeyType: "HASH" }, // Partition key
      { AttributeName: "DiscussionLink", KeyType: "RANGE" }, // Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "CompanyName", AttributeType: "S" },
      { AttributeName: "DiscussionLink", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5, // adjust based on your read requirements
      WriteCapacityUnits: 5, // adjust based on your write requirements
    },
  };

  // Create table
  dynamodb.createTable(tableParams, (err, data) => {
    if (err) {
      console.error(
        "AWS DynamoDB CDL Table Client: Error creating table:",
        err.message
      );
    } else {
      console.log("AWS DynamoDB CDL Table Client: Table created successfully");
    }
  });
}

// let discussionLink = {
//   CompanyName: CompanyName, // Bare minimum
//   DiscussionLink: DiscussionLink,  // Bare minimum
//   Type: "Salary","Culture", "Work Life Balance", "Perks"
// };

/////////// Insert Into CompanyDiscussionsLinks Table //////////
function insertIntoCDLTable(docClient, discussionLink) {
  const putParams = {
    TableName: "CompanyDiscussionsLinks",
    Item: discussionLink,
  };

  // Put the item into the table
  docClient.put(putParams, (err, data) => {
    if (err) {
      console.error(
        "AWS DynamoDB CDL Table Client: Error putting item:",
        err.message
      );
    } else {
      console.log("AWS DynamoDB CDL Table Client: Item added successfully");
    }
  });
}

/////////// Query CompanyDiscussionsLinks Table ////////
async function queryCDLTable(docClient, companyName, type, limit) {
  // Build the KeyConditionExpression based on the provided parameters
  const keyConditionExpression = [];
  const expressionAttributeValues = {};

  if (companyName !== "") {
    keyConditionExpression.push("CompanyName = :companyName");
    expressionAttributeValues[":companyName"] = companyName;
  }

  if (type !== "") {
    keyConditionExpression.push("DatePostedOn = :datePosted");
    expressionAttributeValues[":datePosted"] = type;
  }

  // Construct the final query parameters
  const queryParams = {
    TableName: "CompanyDiscussionsLinks",
    KeyConditionExpression: keyConditionExpression.join(" AND "),
    ExpressionAttributeValues: expressionAttributeValues,
    Limit: limit,
  };

  try {
    // Query the table
    const result = await docClient.query(queryParams).promise();

    // Log the result or process it as needed
    console.log("AWS DynamoDB CDL Table Client: Query result Successful!");

    return result.Items;
  } catch (error) {
    console.error(
      "AWS DynamoDB CDL Table Client: Error querying table:",
      err.message
    );
    throw error;
  }
}

module.exports = {
  createCDLTable,
  insertIntoCDLTable,
  queryCDLTable,
};
