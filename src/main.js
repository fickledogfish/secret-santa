"use strict";

import dotenv from "dotenv";
import log from "log";
import logn from "log-node";
import express from "express";
import bodyParser from "body-parser";

import routes from "./routes.js";
import * as db from "./db.js";

export let connectionPool = null;

export let participants = [];

const main = async () => {
	dotenv.config(); // import environmental variables from the .env file
	logn(); // start logging to the console

	if (process.env.LOG_LEVEL == "debug") {
		log.warn("Log level set to debug, do not use it in production");
	}

	// Connect to the database (all variables should, at this point, be set by
	// dotenv).
	const pool = db.getPool();
	// Test the connection, just to be sure.
	try {
		const client = await pool.connect();
		await client.query("SELECT NOW()");
	} catch (err) {
		log.error(err);
		return;
	}

	const port = process.env.PORT;
	if (port === undefined) throw "Missing PORT";

	const app = express();
	const urlencodedParser = bodyParser.urlencoded({ extended: false });

	// Register routes.
	app.get("/", routes.getRoot);
	app.post("/create", urlencodedParser, routes.create);
	app.get("/read", routes.read);
	app.post("/delete", urlencodedParser, routes.delete);

	// Run the server.
	app.listen(port, () => {
		log.notice(`listening at localhost:${port}`);
	});

	// On exit, close the connection pool.
	await pool.end();
};

await main();
