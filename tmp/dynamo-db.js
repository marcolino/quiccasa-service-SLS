"use strict";

const AWS = require("aws-sdk");
const fs = require('fs');
const config = require("../../config");

console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
AWS.config.update({
  region: config.db.region,
  endpoint: process.env.NODE_ENV === "development" ? config.db.endpointDevelopment : config.db.endpointProduction,
});

const dynamodb = new AWS.DynamoDB();

async function createTable() {
  const params = {
    TableName : "Subscriptions",
    KeySchema: [ // keys
        { AttributeName: "year", KeyType: "HASH"}, // partition key
        { AttributeName: "title", KeyType: "RANGE" } // sort key
    ],
    AttributeDefinitions: [ // fields
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" },
        //{ AttributeName: "date_creation", AttributeType: "S" }, // creation date, ISO_8601
    ],
    BillingMode: "PAY_PER_REQUEST", // PROVISIONED | PAY_PER_REQUEST
    // ProvisionedThroughput: {
    //     ReadCapacityUnits: 2,
    //     WriteCapacityUnits: 2
    // }
  };
  await dynamodb.createTable(params, function(err, data) {
    if (err) {
      if (err.code === "ResourceInUseException") {
        console.warn(`Table ${params.TableName} already present, ignoring createTable request`);
      } else {
        return console.error(`Unable to create table ${params.TableName}, error: ${JSON.stringify(err, null, 2)}`);
      }
    } else {
      console.log(`Created table ${params.TableName}`); //, table description: ${JSON.stringify(data, null, 2)}`);
    }
  });
}

async function populateTable() {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var allMovies = JSON.parse(fs.readFileSync("tests/moviedata.json", "utf8"));
  allMovies.forEach(async function(movie) {
    var params = {
      TableName: "Subscriptions",
      Item: {
        "year":  movie.year,
        "title": movie.title,
        "info":  movie.info,
      }
    };
  
    await docClient.put(params, function(err, data) {
      if (err) {
        return console.error(`Unable to add movie ${movie.title}, error: ${JSON.stringify(err, null, 2)}`);
      } else {
        console.log("Put succeeded:", movie.title);
      }
    });
  });
}

async function deleteTable() {
  const params = {
    TableName : "Subscriptions",
  };
  await dynamodb.deleteTable(params, function(err, data) {
    if (err) {
      if (err.code === "ResourceNotFoundException") {
        console.warn(`Table ${params.TableName} not present, ignoring deleteTable request`);
      } else {
        return console.error(`Unable to delete table ${params.TableName}, error: ${JSON.stringify(err, null, 2)}`);
      }
    } else {
      console.log(`Deleted table ${params.TableName}`); //, table description: ${JSON.stringify(data, null, 2)}`);
    }
  });
}

//deleteTable();
//createTable();
populateTable();
