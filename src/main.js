"use strict";

import dotenv from "dotenv";
import log from "log";
import logn from "log-node";
import express from "express";
import bodyParser from "body-parser";

import routes from "./routes.js";

const main = () => {
	dotenv.config(); // import environmental variables from the .env file
	logn(); // start logging to the console

	const port = process.env.PORT;
	if (port === undefined) throw "Missing PORT";

	const app = express();
	const urlencodedParser = bodyParser.urlencoded({ extended: false });

	// Register routes.
	app.get("/", routes.get.root);
	app.post("/create", urlencodedParser, routes.post.create);
	app.post("/delete", urlencodedParser, routes.post.delete);

	// Run the server.
	app.listen(port, () => {
		log.notice(`listening at localhost:${port}`);
	});
};

main();
