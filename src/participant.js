"use strict";

import isEmail from "validator/lib/isEmail.js";

import { makeEnum } from "./utils.js";

export class Participant {
	constructor(name, email) {
		this.name = name;
		this.email = email;
		this.buysTo = undefined;
	}

	toString() {
		return `${this.name} <${this.email}>`;
	}

	gifts(otherPerson) {
		this.buysTo = otherPerson.toString();
	}

	isValid() {
		if (typeof this.name === "undefined")
			return ParticipantError.undefinedName;

		if (typeof this.email === "undefined")
			return ParticipantError.undefinedEmail;

		// TODO: validate name?

		if (!isEmail(this.email))
			return ParticipantError.invalidEmail;

		return ParticipantError.ok;
	}
}

export const ParticipantError = makeEnum(
	"undefinedName",
	"undefinedEmail",
	"invalidEmail",

	"ok",
);
