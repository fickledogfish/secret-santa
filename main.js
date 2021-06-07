'use strict';

const log = require("log");
require("log-node")();
const express = require("express");
const bodyParser = require("body-parser");
const url = require("url");

const PORT = process.env.PORT || 1337;

const main = () => {
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
		log.notice("Registering %j", user);
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
		// TODO: check if a user is in the DB

		// TODO: do not report errors if the user isn't

		log.notice("Requesting deletion");
	});

	// Run the server.
	app.listen(PORT, () => {
		log.notice(`listening at localhost:${PORT}`);
	});
};

// Hacking a main function into Node.
if (require.main === module) {
	main();
}
