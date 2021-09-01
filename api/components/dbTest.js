"use strict";

const { DB } = require("./components/db");
const { httpJSONResponse } = require("./components/utils");



module.exports.dbTest = async (event, context, callback) => {

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

    callback(null, httpJSONResponse(200, "You did successfully test database"));
  } catch (err) {
    callback(new Error(`Error testing database: ${err}`));
  } finally {
    await db.close();
  }
};
