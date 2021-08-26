"use strict";

const AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-1",
  endpoint: "http://localhost:8001",
  //endpoint: "https://dynamodb.eu-west-1.amazonaws.com",
});

const dynamodb = new AWS.DynamoDB();

function createTable() {
  const params = {
      TableName : "Movies",
      KeySchema: [       
          { AttributeName: "year", KeyType: "HASH"}, // partition key
          { AttributeName: "title", KeyType: "RANGE" } // sort key
      ],
      AttributeDefinitions: [       
          { AttributeName: "year", AttributeType: "N" },
          { AttributeName: "title", AttributeType: "S" }
      ],
      ProvisionedThroughput: {       
          ReadCapacityUnits: 5, 
          WriteCapacityUnits: 5
      }
  };

  dynamodb.createTable(params, function(err, data) {
      if (err) {
          console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
      }
  });
}

createTable();