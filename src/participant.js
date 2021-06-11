"use strict";

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
}
