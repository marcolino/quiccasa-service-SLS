"use strict";

const config = require("../../config");

module.exports.httpJSONResponse = (statusCode = 200, message = "", input = null, headers = {}) => {
  const jsonSpaces = 0;

  console.log("process.env.STAGE:", process.env.STAGE);

  return {
    statusCode,
    headers: {
      // TODO: do we really need this ?
      "Access-Control-Allow-Origin": process.env.STAGE === "prod" ? config.AllowedOrigin : "*",
      "Content-Type": "application/json",
      ...headers
    },
    body: JSON.stringify(
      {
        message,
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