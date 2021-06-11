"use strict";

/* This will generate a circular permutation, which is good because one gift
 * will always lead to the next, eliminating the need for pausing to select the
 * next person or for awkward transitions.
 */
export const circularPairing = (participants) => {
	// Shuffle the array
	for (let i = participants.length - 1; i > 0; i--) {
		// select a random index
		const j = Math.floor(Math.random() * (i + 1));
		[participants[i], participants[j]] = [participants[j], participants[i]];
	}

	// Each person buys to the next one
	for (let i = 0; i < participants.length - 1; i++) {
		buysTo(participants[i], participants[i+1]);
	}
	buysTo(participants[participants.length - 1], participants[0]);
};

const buysTo = (person, otherPerson) => {
	person.buysTo = `${otherPerson.name} <${otherPerson.email}>`;
};
