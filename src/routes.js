"use strict";

import log from "log";
import url from "url";
import path from "path";

export { routes as default };

const routes = {
	get: (req, res) => {
		const dirname = path.dirname(new URL(import.meta.url).pathname);
		res.sendFile(`${dirname}/client/index.html`);
	},

	create: (req, res) => {
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
