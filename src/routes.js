"use strict";

import log from "log";
import url from "url";
import path from "path";
import isEmail from "validator/lib/isEmail.js";

import { participants } from "./main.js";
import { circularPairing } from "./pair.js";

export { routes as default };

const routes = {
	getRoot: (req, res) => {
		const dirname = path.dirname(new URL(import.meta.url).pathname);
		res.sendFile(`${dirname}/client/index.html`);
	},

	create: (req, res) => {
		const name = req.body.name;
		const email = req.body.email;

		// TODO: check if name and email are defined

		log.debug("User %s <%s> wants to join the party", name, email);

		// Assert method.
		if (!assertAction(req, "create")) {
			// TODO: silently redirecting is fine?
			res.redirect("/");
			return;
		}

		// TODO: validate data
		if (!isEmail(email)) {
			log.warn("User %s <%s> is invalid", name, email);
			res.redirect(url.format({
				"pathname": "/",
				"query": {
					"errorType": "invaidEmail"
				}
			}))

			return; // TODO: error code
		}

		// TODO: check if the user is already in the database

		// TODO: insert user in the database
		participants.push({
			name: req.body.name,
			email: req.body.email
		});

		// Redirect back into /.
		res.redirect(url.format({
			"pathname": "/",
			"query": {
				"registered": req.body.email
			}
		}));
	},

	read: (req, res) => {
		let ps = participants;
		circularPairing(ps);
		res.send(ps);
	},

	delete: (req, res) => {
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
	}
};

const assertAction = (req, method) => {
	if (req.body.formAction !== method) {
		log.error(
			"User %s <%s> sent to /%s, but formAction is actually %s",
			req.body.name,
			req.body.email,
			method,
			req.body.formAction
		);

		return false;
	}

	return true;
};
