"use strict";

import log from "log";
import url from "url";
import path from "path";

import * as db from "./db.js";

import { Participant, ParticipantError as PError } from "./participant.js";
import { circularPairing } from "./pair.js";
import { stringifyEnum } from "./utils.js";

export { routes as default };

const routes = {
	getRoot: (req, res) => {
		const dirname = path.dirname(new URL(import.meta.url).pathname);
		res.sendFile(`${dirname}/client/index.html`);
	},

	create: async (req, res) => {
		const p = new Participant(req.body.name, req.body.email);

		// TODO: check if name and email are defined

		log.debug("User %s wants to join the party", p.toString());

		// Assert method.
		if (!assertAction(p, req, "create")) {
			// TODO: silently redirecting is fine?
			res.redirect("/");
			return;
		}

		const pError = p.isValid();
		if (pError != PError.ok) {
			log.warn(
				"User %s is invalid: %s",
				p.toString(),
				stringifyEnum(pError)
			);

			res.redirect(url.format({
				"pathname": "/",
				"query": {
					"errorType": stringifyEnum(pError)
				}
			}))

			return;
		}

		if (await db.isRegistered(p)) {
			log.debug("Attempting to insert duplicate: %s", p);

			// TODO: Sillently redirecting is fine?
			res.redirect("/");
			return;
		}

		try {
			await db.insert(p);
		} catch(err) {
			log.error(err);
			// TODO: redirect with an error
		}

		// Redirect back into /.
		res.redirect(url.format({
			"pathname": "/",
			"query": {
				"registered": p.email
			}
		}));
	},

	read: async (req, res) => {
		log.debug("Rolling the dice");

		const participants = await db.getAll();

		// Convert DB response into an array of Participants
		let ps = [];
		for (const p of participants) {
			ps.push(new Participant(p.name, p.email));
		}

		circularPairing(ps);

		// TODO: Send email

		log.debug("Rolling result: %o", ps);

		// Redirect pack to root
		res.redirect(url.format({
			"pathname": "/",
				"query": {
					"generated": true
				}
		}));
	},

	delete: async (req, res) => {
		const p = new Participant(req.body.name, req.body.email);

		log.debug("User %s requesting deletion", p.toString());

		// Assert method.
		if (!assertAction(p, req, "delete")) {
			// TODO: silently redirecting is fine?
			res.redirect("/");
			return;
		}

		await db.remove(p);

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
