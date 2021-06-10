"use strict";

import dotenv from "dotenv";
import log from "log";
import logn from "log-node";
import express from "express";
import bodyParser from "body-parser";

import routes from "./routes.js";

export let participants = [];

const main = () => {
	dotenv.config(); // import environmental variables from the .env file
	logn(); // start logging to the console

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

main();
