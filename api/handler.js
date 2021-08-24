"use strict";

//const AWS = require("aws-sdk");
//const config = require("../config");

const s3 = require("aws-sdk/clients/s3");
const cognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
const cognitoIdp =  new cognitoIdentityServiceProvider({apiVersion: "2016-04-18"});
// const cognitoIdp = new AWS.CognitoIdentityServiceProvider({apiVersion: "2016-04-18"});
// const s3 = new AWS.S3();
//const https = require("https");

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

module.exports.getUserByAttribute = async (event, context, callback) => {

  console.log("event:", event);
  console.log("context:", context);

  const email = event.queryStringParameters.email;
  if (!email) {
    return httpJSONResponse(400, "Email should be specified", event);
  }

  const params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID, //cognitoUserPoolId, //config.cognitoUserPoolId, //event.userPoolId,
    Filter: `email = "${email}"`,
  };

  cognitoIdp.listUsers(params).promise()
    .then (result => {
      console.log("listUsers " + result.Users.length + " results:", JSON.stringify(result.Users));
      callback(undefined, result.Users);
      //httpJSONResponse(200, `Users:`, result.Users);
    })
    .catch (error => {
      console.error("error:", error);
      callback(error);
      //httpJSONResponse(500, `ERROR:`, error); 
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
