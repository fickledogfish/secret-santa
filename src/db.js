"use strict";

import pg from "pg";

let connectionPool = null;

export const getPool = () => {
	if (!connectionPool) connectionPool = new pg.Pool({
		user: process.env.DB_USER,
		host: process.env.DB_HOST,
		database: process.env.DB_DATABASE,
		password: process.env.DB_PASS,
		port: process.env.DB_PORT,
	});

	return connectionPool;
};
