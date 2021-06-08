'use strict';

// Load environmental variables from the .env file.
require("dotenv").config();

const log = require("log");
require("log-node")(); // start logging to the console

const express = require("express");
const bodyParser = require("body-parser");

const routes = require("./routes.js");

const main = () => {
	const port = process.env.PORT;
	if (port === undefined) throw "Missing PORT";

	const app = express();
	const urlencodedParser = bodyParser.urlencoded({ extended: false });

	app.get("/", routes.get.root);

	// Register a user.
	app.post("/create", urlencodedParser, routes.post.create);

	// Delete a user.
	app.post("/delete", urlencodedParser, routes.post.delete);

	// Run the server.
	app.listen(port, () => {
		log.notice(`listening at localhost:${port}`);
	});
};

// Hacking a main function into Node.
if (require.main === module) {
	main();
}
