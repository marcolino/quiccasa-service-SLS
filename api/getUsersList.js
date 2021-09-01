"use strict";

/*
const AWS = require("aws-sdk");
const { httpJSONResponse } = require("./components/utils");

module.exports.getUsersList = async (event, context, callback) => {
  console.log("event:", event, typeof event);
  console.log("context:", context);

  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: "2016-04-18"});

  const USER_POOL_ID = "eu-west-1_edKzSSeU9";

  var params = {
    UserPoolId: USER_POOL_ID,
  };
  cognitoidentityserviceprovider.listGroups(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      console.log("Groups list:");
      data.Groups.map(groups => {
        console.log(groups.GroupName);
      });
      data.Groups.map( groupEntity => {
        const params = {
          GroupName: groupEntity.GroupName,
          UserPoolId: USER_POOL_ID,
        };
        cognitoidentityserviceprovider.listUsersInGroup(params, function(err1, data1) {
          if (err1) {
            console.log(err1, err1.stack); // an error occurred
            callback(new Error(err1));
          } else {
            console.log(`${groupEntity.GroupName} has ${data1.Users.length} users`);
            data1.Users.map(userEntity => {
              console.log("user:", userEntity.Username);
            });
          }
          callback(httpJSONResponse(200, {users: data1.Users}, event));
        });
      });
    }
  });
};
*/

const cognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
const cognitoIdp = new cognitoIdentityServiceProvider({apiVersion: "2016-04-18"});

//const { httpJSONResponse } = require("./components/utils");
//const AWS = require("aws-sdk");

//const cognitoIdp = new AWS.CognitoIdentityServiceProvider();

module.exports.getUsersList = async (event, context, callback) => {
  console.log("event:", event, typeof event);
  console.log("context:", context);
  console.log("process.env.userPoolId:", process.env.userPoolId);
  const params = {
    UserPoolId: "eu-west-1_edKzSSeU9", //process.env.userPoolId,
    //Filter: `${attributeName} = "${attributeValue}"`,
  };
  try {
    const data = await cognitoIdp.listUsers(params).promise();
    const existingUser = data.Users.filter(user => user.UserStatus !== "EXTERNAL_PROVIDER")[0];
    if (existingUser == null) {
      console.log("Error", "User not found");
    }
    return callback(null, {existingUser});
  } catch (error) {
    console.log("getUsersList error:", error);
    return callback(error);
  }

  /*
module.exports.getUsersList = async (event, context, callback) => {
  console.log("event:", event, typeof event);
  console.log("context:", context);

  // const sub = event && event.requestConext ? event.requestContext.identity.cognitoAuthenticationProvider : null;
  // console.log("cognitoAuthenticationProvider:", sub);

  const email = event.queryStringParameters.email;
  if (!email) {
    return httpJSONResponse(400, {error: "Email should be specified"}, event);
  }

  console.log("1");
  const userPoolId = "eu-west-1_edKzSSeU9";
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  console.log("2");
  const request = {
    UserPoolId: userPoolId, //process.env.AUTH_WEREWOLVESCD8882B7_USERPOOLID, // required
    Limit: 10,
  };
  console.log("3");
  try {
    const data = await cognitoidentityserviceprovider.listUsers(request).promise();
    console.log("data:", data);
    callback(null, 200);
  } catch (err) {
    console.error(err);
    callback(new Error(err));
  }
  // cognitoidentityserviceprovider.listUsers(params, function(err, data) {
  //   console.log("4");
  //   if (err) {
  //     console.error(err);
  //     callback(new Error(err));
  //   }
  //   console.log(data);
  //   callback(httpJSONResponse(200, {users: data.Users}, event));
  //   console.log("5");
  // });
  console.log("6");
*/

/*
  // const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  // const parts = authProvider.split(":");
  // const userPoolIdParts = parts[parts.length - 3].split("/");
  // const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
  // const userPoolUserId = parts[parts.length - 1];
  const userPoolId = "eu-west-1_edKzSSeU9"; // ok locally
  //const userPoolId = "eu-west-1_Jkt5YeKxr"; // ko locally
  //const userPoolId = "eu-west-1_Z7kqmsNd5"; // ko locally

  const request = {};
  request.UserPoolId = userPoolId;
  if (email !== "*") {
    request.Filter = `email = "${email}"`;
    //request.Filter = 'sub = "' + userPoolUserId + '"';
    request.Limit = 1;
  }
  console.log("request:", request);

  await cognitoIdp.listUsers(request).promise()
    .then(results => {
      console.log(results);
      const username = results.Users[0].Username;
      console.log("Found username:", username);
      return httpJSONResponse(100, {username}, event);
    })
    .catch(e => {
      console.error(e);
      return httpJSONResponse(500, {error: "Email should be specified"}, event);
    })
  ;

  // try {
  //   let data = await cognitoIdp.listUsers(request).promise();
  //   console.log("got user:", data.Users[0]);
  //   callback(null, httpJSONResponse(200, data.Users, event));
  // } catch (err) {
  //   console.error("error:", err);
  //   callback(new Error(err));
  // }

  // await cognitoIdp.listUsers(params).promise()
  //   .then (result => {
  //     console.log("listUsers result:", result);
  //     console.log("listUsers count:", result.Users.length);
  //     callback(null, httpJSONResponse(200, result.Users, event));
  //   })
  //   .catch (error => {
  //     console.error("error:", error);
  //     callback(new Error(error));
  //   })
  // ;
*/
};
