"use strict";

import dotenv from "dotenv";
import log from "log";
import logn from "log-node";
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

import routes from "./routes.js";

export let participants = [];

const main = async () => {
	dotenv.config(); // import environmental variables from the .env file
	logn(); // start logging to the console

	// Connect to the database (all variables should, at this point, be set by
	// dotenv).
	const db = new pg.Client({
		user: process.env.DB_USER,
		host: process.env.DB_HOST,
		database: process.env.DB_DATABASE,
		password: process.env.DB_PASS,
		port: process.env.DB_PORT,
	});
	await db.connect();
	const res = await db.query("SELECT NOW()");
	await db.end();

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
};

await main();
