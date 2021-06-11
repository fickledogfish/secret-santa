"use strict";

import log from "log";
import url from "url";
import path from "path";

import { participants } from "./main.js";
import { Participant } from "./participant.js";
import { circularPairing } from "./pair.js";

export { routes as default };

const routes = {
	getRoot: (req, res) => {
		const dirname = path.dirname(new URL(import.meta.url).pathname);
		res.sendFile(`${dirname}/client/index.html`);
	},

	create: (req, res) => {
		const p = new Participant(req.body.name, req.body.email);

		// TODO: check if name and email are defined

		log.debug("User %s wants to join the party", p.toString());

		// Assert method.
		if (!assertAction(p, req, "create")) {
			// TODO: silently redirecting is fine?
			res.redirect("/");
			return;
		}

		// TODO: validate data
		if (!p.isValid()) {
			log.warn("User %s is invalid", p.toString());
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
		participants.push(p);

		// Redirect back into /.
		res.redirect(url.format({
			"pathname": "/",
			"query": {
				"registered": p.email
			}
		}));
	},

	read: (req, res) => {
		let ps = participants;
		circularPairing(ps);
		res.send(ps);
	},

	delete: (req, res) => {
		const p = new Participant(req.body.name, req.body.email);

		log.debug("User %s requesting deletion", p.toString());

		// Assert method.
		if (!assertAction(p, req, "delete")) {
			// TODO: silently redirecting is fine?
			res.redirect("/");
			return;
		}

		// TODO: check if a user is in the DB

		// Return without reporting anything.
		res.redirect("/");
	}
};

const assertAction = (participant, req, method) => {
	if (req.body.formAction !== method) {
		log.error(
			"User %s sent to /%s, but formAction is actually %s",
			participant.toString(),
			method,
			req.body.formAction
		);

		return false;
	}

	return true;
};
