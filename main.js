'use strict';

const log = require('log');
require('log-node')();
const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 1337;

const main = () => {
	const app = express();
	const urlencodedParser = bodyParser.urlencoded({ extended: false });

	app.get('/', (req, res) => {
		res.sendFile(`${__dirname}/client/index.html`)
	});

	// Register a user
	app.post('/create', urlencodedParser, (req, res) => {
		log.notice(req.body);
		res.send('ok');
	});

	// Delete a user
	app.post('/delete', urlencodedParser, (req, res) => {
		log.notice(req.body);
		res.send('ok');
	});

	app.listen(PORT, () => {
		log.notice(`listening at localhost:${PORT}`);
	});
};

if (require.main === module) {
	main();
}
