'use strict';

module.exports.httpJSONResponse = (statusCode = 200, message = "", input = null, headers = {}) => {
  const jsonSpaces = 0;

  return {
    statusCode,
    headers: {
      //"Access-Control-Allow-Origin": "*", // TODO: do we really need this ?
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
}

module.exports.formatMoney = (number, locale, currency) => {
  return number.toLocaleString(locale, { style: 'currency', currency });
}

module.exports.formatMoneyNoDecimals = (number, locale, currency) => {
  return module.exports.formatMoney(number, locale, currency).replace(/,[\d]*/, "");
}