"use strict";

import log from "log";
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

/*
 * Sets everything up if the database is empty. This function should create all
 * needed tables for the application.
 */
export const setup = async () => {
	const client = await connectionPool.connect();

	// FIXME: do not use a sequential identifier for the users.
	log.debug("Creating users table");
	await client.query(
		"CREATE TABLE IF NOT EXISTS users (id SERIAL, name TEXT, email TEXT)"
	);

	client.release();
};
