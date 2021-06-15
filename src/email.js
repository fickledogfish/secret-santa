"use strict";

import log from "log";

import * as nm from "nodemailer";

export const sendResults = async (participants) => {
	const acc = await credentials();
	const transporter = nm.createTransport({
		host: acc.smtp.host,
        port: acc.smtp.port,
        secure: acc.smtp.secure,
        auth: {
            user: acc.user,
            pass: acc.pass
        }
	});

	for (const p of participants) {
		if (!p.buysTo) throw `${p.toString()} is not gifting anyone?!`;
		log.debug("%s is gifting %s", p, p.buysTo);

		await sendMail(transporter, p);
	}
};

const credentials = async () => {
	return await nm.createTestAccount();
};

const sendMail = async (transporter, participant) => {
	const info = await transporter.sendMail({
        from: participant.toString(),
        to: participant.buysTo,
        subject: "Secret Santa",
        text: `You'll be gifting... ${participant.toString()}!`,
	});

	log.debug("Message sent: %s", info.messageId);
	log.debug("Preview URL: %s", nm.getTestMessageUrl(info));
};
