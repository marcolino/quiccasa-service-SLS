"use strict";

const { DB } = require("./components/db");
const { httpJSONResponse } = require("./components/utils");



module.exports.dbSetup = async (event, context, callback) => {
  console.log("process.env:", process.env);
  let db = null;
  try {
    db = await new DB();
    await db.connect(event, context);
    await db.setup(event, context);
    callback(null, httpJSONResponse(200, "You did successfully setup database"));
  } catch (err) {
    callback(new Error(`Error setting up database: ${err}`));
  } finally {
    await db.close();
  }
};
