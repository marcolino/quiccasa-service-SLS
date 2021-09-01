"use strict";

//const AWS = require("aws-sdk");
//const config = require("../config");

const s3 = require("aws-sdk/clients/s3");
const cognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
const cognitoIdp = new cognitoIdentityServiceProvider({apiVersion: "2016-04-18"});
//const db = require('mysql2/promise');
const { DB } = require("./components/db");
const { httpJSONResponse } = require("./components/utils");

//const db = require("mysql2/promise");
//const mysql = require("serverless-mysql")(); // <-- initialize with function call



module.exports.dbSetup = async (event, context, callback) => {
  //console.log("event:", event);
  //console.log("context:", context);
  let db = null;
  try {
    db = await new DB();
    await db.connect(event, context);
    await db.setup(event, context);
    callback(null, httpJSONResponse(200, "You did successfully setup database"));
  } catch (err) {
    callback(new Error(`Error setting up database: ${err}`));
  } finally {
    await db.close();
  }
};

module.exports.dbTest = async (event, context, callback) => {

  let db = null;
  try {
    db = new DB();
    await db.connect();

    // query database
    const [result] = await db.con.execute(`
      INSERT INTO subscriptions
      (
        \`id_user\`
      )
      VALUES
      (
        ${Math.random() * 999999999}
      )
    `);
    console.log("result:", result);

    const [rows] = await db.con.execute(`
      SELECT * FROM subscriptions
    `);
    console.log("rows:", rows, rows[0].id);

    callback(null, httpJSONResponse(200, "You did successfully test database"));
  } catch (err) {
    callback(new Error(`Error testing database: ${err}`));
  } finally {
    await db.close();
  }
};

module.exports.getUsersList = async (event, context, callback) => {

  console.log("event:", event, typeof event);
  console.log("context:", context);

  const email = event.queryStringParameters.email;
  if (!email) {
    return httpJSONResponse(400, {error: "Email should be specified"}, event);
  }

  const params = {};
  params.UserPoolId = "eu-west-1_edKzSSeU9"; //process.env.COGNITO_USER_POOL_ID, //cognitoUserPoolId, //config.cognitoUserPoolId, //event.userPoolId,
  if (email !== "*") {
    params.Filter = `email = "${email}"`;
  }
  console.log("params:", params);

  await cognitoIdp.listUsers(params).promise()
    .then (result => {
      console.log("listUsers result:", result);
      console.log("listUsers count:", result.Users.length);
      callback(null, httpJSONResponse(200, result.Users, event));
    })
    .catch (error => {
      console.error("error:", error);
      callback(new Error(error));
    })
  ;
};

// example of a promise returning function
module.exports.getS3ObjectWithPromiseExample = async function(event, context, callback) {
  console.log("event:", event);
  console.log("key:", event.Records[0].s3.object.key);
  console.log("context:", context);
  console.log("callback:", callback);

  try {
    const params = {
      Bucket: "quiccasa-service-dev-serverlessdeploymentbucket-vg420l6zig0g", 
      //Key: "*", // doesn't work
      Key: event.Records[0].s3.object.key,
    };
    const obj = await s3.getObject(params).promise();
    callback(null, httpJSONResponse(200, obj, event));
  } catch (err) {
    console.error("error:", err);
  }

  // or you can omit `await` here whatsoever:
  // return s3.getObject(params).promise();
};
