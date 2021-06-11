"use strict";

/* This will generate a circular permutation, which is good because one gift
 * will always lead to the next, eliminating the need for pausing to select the
 * next person or for awkward transitions.
 *
 * Upside is that this is a really simple solution, and it's not very complex.
 * Downside is that you're missing out on plenty of permutations.
 */
export const circularPairing = (participants) => {
	// Shuffle the array for good measure.
	shuffleArray(participants);

	// And now each person buys to the next one.
	for (let i = 0; i < participants.length - 1; i++) {
		participants[i].gifts(participants[i+1]);
	}
	// Can't assign the last person in the loop.
	participants[participants.length - 1].gifts(participants[0]);
};

const shuffleArray = (arr) => {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
};
