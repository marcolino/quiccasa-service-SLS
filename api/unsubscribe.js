"use strict";

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