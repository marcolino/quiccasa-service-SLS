"use strict";

const db = require("mysql2/promise");
//const config = require("../../config");

class DB {
  constructor() {
    //this.con = this.createConnection();
  }

  async connect(/*event, context*/) {
    //context.callbackWaitsForEmptyEventLoop = false;
    const local = !process.env.AWS_EXECUTION_ENV; // this variable should be set only on AWS... - TODO ...
    console.log("IS_LOCAL:", local);
    try {
      this.con = await db.createConnection({
        host: local ? process.env.MYSQL_HOST_DEV : process.env.MYSQL_HOST,
        port: local ? process.env.MYSQL_PORT_DEV : process.env.MYSQL_PORT,
        user: local ? process.env.MYSQL_USER_DEV : process.env.MYSQL_USER,
        password: local ? process.env.MYSQL_PASS_DEV : process.env.MYSQL_PASS,
        database: local ? process.env.MYSQL_NAME_DEV : process.env.MYSQL_NAME,
        //debug: false,
      });
    } catch(err) {
      console.error("connect error:", err);
      return undefined;
    }
  }

  async close() {
    if (this.con) {
      this.con.end();
    }
  }

  async setup() {
    // create tables
    let result = [];

    [result] = await this.con.execute(`
      DROP TABLE IF EXISTS \`subscriptions\`
    `);
    [result] = await this.con.execute(`
      CREATE TABLE IF NOT EXISTS \`subscriptions\` (
        \`id\` bigint(20) NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
        \`id_user\` bigint(20) NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY \`id_user\` (\`id_user\`)
      ) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8
    `);
    return result;
  }
}

module.exports = { DB };