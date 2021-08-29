"use strict";

//const AWS = require("aws-sdk");
const config = require("../config");

const s3 = require("aws-sdk/clients/s3");
const cognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
const cognitoIdp = new cognitoIdentityServiceProvider({apiVersion: "2016-04-18"});
//const db = require('mysql2/promise');
const { DB } = require("./components/db");
const { httpJSONResponse } = require("./components/utils");

//const db = require("mysql2/promise");
const mysql = require("serverless-mysql")(); // <-- initialize with function call



module.exports.dbSetup = async () => {
  let db = null;
  try {
    db = await new DB();
    await db.connect();
    await db.setup();
    return httpJSONResponse(200, "You did successfully setup database");
  } catch (err) {
    return httpJSONResponse(500, `Error setting up database: ${err}`);
  } finally {
    await db.close();
  }
};

module.exports.dbTest = async () => {

  let db = null;
  try {
    db = new DB();
    await db.connect();

    // query database
    const [result] = await db.con.execute(`
      INSERT INTO subscriptions
      (
        \`id_user\`
      )
      VALUES
      (
        ${Math.random() * 999999999}
      )
    `);
    console.log("result:", result);

    const [rows] = await db.con.execute(`
      SELECT * FROM subscriptions
    `);
    console.log("rows:", rows, rows[0].id);

    return httpJSONResponse(200, "You did successfully test database");
  } catch (err) {
    return httpJSONResponse(500, `Error testing database: ${err}`);
  } finally {
    await db.close();
  }
};

module.exports.dbok = async () => {
  const local = !process.env.AWS_EXECUTION_ENV; // this variable should be set only on AWS... - TODO ...
  console.log("local:", local);
  let result = null;
  let c = {
    host: local ? config.db.local.host : process.env.MYSQL_HOST,
    port: local ? config.db.local.port : process.env.MYSQL_PORT,
    user: local ? config.db.local.user : process.env.MYSQL_USER,
    password: local ? config.db.local.pass : process.env.MYSQL_PASS,
    database: local ? config.db.local.name : process.env.MYSQL_NAME,
    //connectionLimit: local ? config.db.local.connectionLimit : config.db.remote.connectionLimit,
    //queueLimit: local ? config.db.local.queueLimit : config.db.remote.queueLimit,
  };
  console.log("c:", c);


  result = await mysql.config(c);
  console.log("config result:", result);

  result = await mysql.connect();
  console.log("CONNECTED:", result);

  result = await mysql.query("SELECT * FROM subscriptions");
  console.log("query result:", result);

  await mysql.end();
  //return result;
  return httpJSONResponse(200, {result});
};

/*
module.exports.dbok = async () => {
  console.log("process.env:", process.env);
  const local = !process.env.AWS_EXECUTION_ENV; // this variable should be set only on AWS... - TODO ...
  console.log("IS_LOCAL:", local);
  console.log("config.db:", config.db);

  let connection = null;
  let result = [];
  let c = {
    host: local ? config.db.local.host : process.env.MYSQL_HOST,
    port: local ? config.db.local.port : process.env.MYSQL_PORT,
    user: local ? config.db.local.user : process.env.MYSQL_USER,
    password: local ? config.db.local.pass : process.env.MYSQL_PASS,
    database: local ? config.db.local.name : process.env.MYSQL_NAME,
    //connectionLimit: local ? config.db.local.connectionLimit : config.db.remote.connectionLimit,
    //queueLimit: local ? config.db.local.queueLimit : config.db.remote.queueLimit,
  };
  console.log("c:", c);

  try {
    connection = await db.createConnection(c/*{
      host: local ? config.db.local.host : process.env.MYSQL_HOST,
      port: local ? config.db.local.port : process.env.MYSQL_PORT,
      user: local ? config.db.local.user : process.env.MYSQL_USER,
      password: local ? config.db.local.pass : process.env.MYSQL_PASS,
      database: local ? config.db.local.name : process.env.MYSQL_NAME,
      connectionLimit: local ? config.db.local.connectionLimit : config.db.remote.connectionLimit,
      queueLimit: local ? config.db.local.queueLimit : config.db.remote.queueLimit,
    }* /);
    console.log("connection:", connection);

    [result] = await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`subscriptions\` (
        \`id\` bigint(20) NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
        \`id_user\` bigint(20) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY \`id_user\` (\`id_user\`)
      ) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8
    `);

    console.log("CREATE TABLE result:", result);

    [result] = await connection.execute(`
      INSERT INTO \`subscriptions\` (
        \`id_user\`
      ) VALUES (
        1
      )
    `);
    // query database using promises
    const [rows] = await connection.execute("SELECT * FROM subscriptions");

    console.log("rows:", rows);
    connection.end();
    return httpJSONResponse(200, "success");
  } catch(err) {
    console.error("error:", err);
    if (connection) connection.end();
    return httpJSONResponse(500, `Error: ${err}`);
  }
};
*/

module.exports.unsubscribe = async (event) => {
  const serviceName = "quiccasa"; // TODO: get from global environmnt/config...

  console.log("event:", event);
  const username = event.queryStringParameters.username;
  if (!username) {
    return httpJSONResponse(400, "Username should be specified", event);
  }

  return httpJSONResponse(200, `You did successfully unsubscribe from ${serviceName}!`, event);
};

module.exports.getUsersList = async (event, context, callback) => {

  console.log("event:", event, typeof event);
  console.log("context:", context);

  const email = event.queryStringParameters.email;
  if (!email) {
    return httpJSONResponse(400, {error: "Email should be specified"}, event);
  }

  const params = {};
  params.UserPoolId = "eu-west-1_edKzSSeU9"; //process.env.COGNITO_USER_POOL_ID, //cognitoUserPoolId, //config.cognitoUserPoolId, //event.userPoolId,
  if (email !== "*") {
    params.Filter = `email = "${email}"`;
  }
  console.log("params:", params);

  await cognitoIdp.listUsers(params).promise()
    .then (result => {
      console.log("listUsers result:", result);
      console.log("listUsers count:", result.Users.length);
      callback(undefined, httpJSONResponse(200, result.Users, event));
    })
    .catch (error => {
      console.error("error:", error);
      callback(httpJSONResponse(500, {error}, event));
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
