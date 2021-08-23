'use strict';

//const config = require("../config");
const { httpJSONResponse } = require("./components/utils");

module.exports.unsubscribe = async (event) => {
  const serviceName = "quiccasa"; // TODO: get from global environmnt/config...

  console.log('event:', event);
  const username = event.queryStringParameters.username;
  if (!username) {
    return httpJSONResponse(400, `Username should be specified`, event)
  }

  return httpJSONResponse(200, `You did successfully unsubscribe from ${serviceName}!`, event);
};

module.exports.getUserByAttribute = async (event) => {

  console.log('event:', event);
  const { attributeName, attributeValue } = event;

  const params = {
      UserPoolId: process.env.userPoolId,
      Filter: `${attributeName} = "${attributeValue}"`,
  }
  try {
      const data = await cognitoIdentityService.listUsers(params).promise()
      const existingUser = data.Users.filter(user => user.UserStatus !== 'EXTERNAL_PROVIDER')[0]
      if (existingUser == null) {
          console.log('Error', 'User not found');
      }
      return existingUser;
  } catch (error) {
      console.log('Error: getUserByAttribute', error);
  }
}