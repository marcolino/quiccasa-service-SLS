'use strict';

module.exports.unsubscribe = async (event) => {
  const serviceName = "quiccasa"; // TODO: get from global environmnt/config...

  console.log('event:', event, typeof event);
  const username = event && event.queryStringParameters ? event.queryStringParameters.username : null;
  
  if (!username) {
    return respond(400, { error: `Username should be specified` });
  }

  // TODO: the real meat here...

  return respond(200, { message: `You did successfully unsubscribe from ${serviceName}!` });

  // use this code if you don't use the http event with the LAMBDA-PROXY integration:
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const respond = (statusCode, response) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(
      {
        ...response,
        //input: event,
      },
      null,
      //2
    ),
  };
}