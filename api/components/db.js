"use strict";

const db = require("mysql2/promise");
const config = require("../../config");

class DB {
  constructor() {
    //this.con = this.createConnection();
  }

  async connect() {
    const local = !process.env.AWS_EXECUTION_ENV; // this variable should be set only on AWS... - TODO ...
    console.log("IS_LOCAL:", local);
    console.log("config.db:", config.db);
    try {
      this.con = await db.createConnection({
        // TODO: put local constants to config.js
        host: local ? config.db.local.host : process.env.MYSQL_HOST,
        port: local ? config.db.local.port : process.env.MYSQL_PORT,
        user: local ? config.db.local.user : process.env.MYSQL_USER,
        password: local ? config.db.local.pass : process.env.MYSQL_PASS,
        database: local ? config.db.local.name : process.env.MYSQL_NAME,
        //connectionLimit: local ? config.db.local.connectionLimit : config.db.remote.connectionLimit,
        //queueLimit: local ? config.db.local.queueLimit : config.db.remote.queueLimit,
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