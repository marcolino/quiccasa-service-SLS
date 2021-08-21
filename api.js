'use strict';

module.exports.unsubscribe = async (event) => {
  const serviceName = "quiccasa"; // TODO: get from global environmnt/config...

  console.log('event:', event, typeof event);
  const username = event && event.queryStringParameters ? event.queryStringParameters.username : null;
  if (!username) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: //JSON.stringify(
        {
          message: `Username should be specified`,
          input: event,
        }
      //),
    };
  }

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