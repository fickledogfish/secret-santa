"use strict";

import isEmail from "validator/lib/isEmail.js";

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
		return (typeof this.name !== "undefined") &&
			(typeof this.email !== "undefined") &&
			// TODO: validate name?
			isEmail(this.email);
	}
}
