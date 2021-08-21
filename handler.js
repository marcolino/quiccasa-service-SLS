'use strict';

module.exports.hello = async (event) => {
  const serviceName = "quiccasa"; // TODO: get from global environmnt/config...

  // TODO: do the real job!

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*' // TODO: do we really need this ?
    },
    body: JSON.stringify(
      {
        message: `You did successfully unsubscribe from ${serviceName}!`,
        input: event,
      },
      null,
      2
    ),
  };

  // use this code if you don't use the http event with the LAMBDA-PROXY integration:
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

