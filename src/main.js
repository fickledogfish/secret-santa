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
		log.debug(
			"User %s <%s> wants to join the party",
			req.body.name,
			req.body.email
		);

		// Assert method.
		if (!assertAction(req, "create")) {
			// TODO: silently redirecting is fine?
			res.redirect("/");
			return;
		}

		// TODO: validate data

		// TODO: check if the user is already in the database

		// TODO: insert user in the database

		// Redirect back into /.
		res.redirect(url.format({
			"pathname": "/",
			"query": {
				"registered": req.body.email
			}
		}));
	});

	// Delete a user.
	app.post("/delete", urlencodedParser, (req, res) => {
		log.debug(
			"User %s <%s> requesting deletion",
			req.body.name,
			req.body.email
		);

		// Assert method.
		if (!assertAction(req, "delete")) {
			// TODO: silently redirecting is fine?
			res.redirect("/");
			return;
		}

		// TODO: check if a user is in the DB

		// Return without reporting anything.
		res.redirect("/");
	});

	// Run the server.
	app.listen(port, () => {
		log.notice(`listening at localhost:${port}`);
	});
};

const assertAction = (req, method) => {
	if (req.body.formAction !== method) {
		log.error(
			"User %s <%s> sent to /create, but formAction is actually %s",
			req.body.name,
			req.body.email,
			req.body.formAction
		);

		return false;
	}

	return true;
};

// Hacking a main function into Node.
if (require.main === module) {
	main();
}
