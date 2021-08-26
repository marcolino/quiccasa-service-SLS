"use strict";

const config = require("../../config");

module.exports.httpJSONResponse = (statusCode = 200, data = {}, input = null, headers = {}) => {
  const jsonSpaces = 0;

  process.env.STAGE && console.log("process.env.STAGE:", process.env.STAGE);

  return {
    statusCode,
    headers: {
      // TODO: do we really need this ?
      "Access-Control-Allow-Origin": process.env.STAGE === "prod" ? config.AllowedOrigin : "*", // required for CORS support to work
      "Access-Control-Allow-Credentials": true, // required for cookies and authorization headers with HTTPS
      "Content-Type": "application/json",
      ...headers
    },
    body: JSON.stringify(
      {
        data,
        input,
      },
      null, // replacer
      jsonSpaces, // spaces
    ),
  };
};

module.exports.formatMoney = (number, locale, currency) => {
  return number.toLocaleString(locale, { style: "currency", currency });
};

module.exports.formatMoneyNoDecimals = (number, locale, currency) => {
  return module.exports.formatMoney(number, locale, currency).replace(/,[\d]*/, "");
};