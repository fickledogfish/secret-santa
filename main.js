'use strict';

const url = require("url");

// Load environmental variables from the .env file.
require("dotenv").config();

const log = require("log");
require("log-node")(); // start logging to the console

const express = require("express");
const bodyParser = require("body-parser");

const main = () => {
	const port = process.env.PORT;
	if (port === undefined) throw "Missing PORT";

	const app = express();
	const urlencodedParser = bodyParser.urlencoded({ extended: false });

	app.get("/", (req, res) => {
		res.sendFile(`${__dirname}/client/index.html`)
	});

	// Register a user.
	app.post("/create", urlencodedParser, (req, res) => {
		// TODO: validate data

		// TODO: check if the user is already in the database

		// TODO: insert user in the database

		const user = req.body;
		log.debug("Registering %j", user);
		// res.send('ok');

		// Redirect back into /.
		res.redirect(url.format({
			"pathname": "/",
			"query": {
				"registered": user.email
			}
		}));
	});

	// Delete a user.
	app.post("/delete", urlencodedParser, (req, res) => {
		log.debug("User %s requesting deletion", req.body.user);

		// TODO: check if a user is in the DB

		// TODO: do not report errors if the user isn't
	});

	// Run the server.
	app.listen(port, () => {
		log.notice(`listening at localhost:${port}`);
	});
};

// Hacking a main function into Node.
if (require.main === module) {
	main();
}
