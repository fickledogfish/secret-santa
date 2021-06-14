"use strict";

import log from "log";
import pg from "pg";

// Note that there's no need to ever end() it, since it'll live for the entire
// program.
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
		"CREATE TABLE IF NOT EXISTS users (" +
			"id SERIAL PRIMARY KEY," +
			"name TEXT NOT NULL," +
			"email TEXT NOT NULL" +
		")"
	);

	client.release();
};

export const insert = async (participant) => {
	const client = await connectionPool.connect();

	log.debug("Inserting %s into the database", participant);
	const res = await client.query(
		"INSERT INTO users(name, email) VALUES ($1, $2) RETURNING *",
		[participant.name, participant.email],
	);
	log.debug("DB response: ", res.rows);

	client.release();
};

export const getAll = async () => {
	const client = await connectionPool.connect();

	log.debug("Retrieving all participants");
	const res = await client.query("SELECT name, email FROM users");
	log.debug(res.rows);
	log.debug(`Retrieved ${res.rows.length} participants`);

	client.release();

	return res.rows;
};
