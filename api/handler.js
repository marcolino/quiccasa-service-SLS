"use strict";

//const AWS = require("aws-sdk");
//const config = require("../config");

const s3 = require("aws-sdk/clients/s3");
const cognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
const cognitoIdp = new cognitoIdentityServiceProvider({apiVersion: "2016-04-18"});
const { httpJSONResponse } = require("./components/utils");

module.exports.unsubscribe = async (event) => {
  const serviceName = "quiccasa"; // TODO: get from global environmnt/config...

  console.log("event:", event);
  const username = event.queryStringParameters.username;
  if (!username) {
    return httpJSONResponse(400, "Username should be specified", event);
  }

  return httpJSONResponse(200, `You did successfully unsubscribe from ${serviceName}!`, event);
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
      callback(undefined, httpJSONResponse(200, result.Users, event));
    })
    .catch (error => {
      console.error("error:", error);
      callback(httpJSONResponse(500, {error}, event));
    })
  ;
};

// example of a promise returning function
module.exports.getS3ObjectWithPromiseExample = async function(event, context, callback) {
  console.log("event:", event);
  console.log("context:", context);
  console.log("callback:", callback);

  try {
    const params = {
      Bucket: "quiccasa-service-dev-serverlessdeploymentbucket-vg420l6zig0g", 
      Key: "*" // doesn't work
    };
    return await s3.getObject(params).promise();
  } catch (err) {
    console.error("error:", err);
  }

  // or you can omit `await` here whatsoever:
  // return s3.getObject(params).promise();
};
