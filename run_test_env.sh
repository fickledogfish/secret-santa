#!/bin/sh

# Setups the local testing environment for the app. Relies on the user being
# part of the docker group.

DOCKER='/bin/docker'
DOCKER_PG_NAME='secret-santa-pg'
DOCKER_LOG_FILE='./docker-log.txt'

NPM='/bin/npm'
NPM_INSTALL_LOG_FILE='./npmi-log.txt'
NPM_LOG_FILE='./npm-log.txt'

SRC_DIR='./src'

# Termination code
terminate() {
	trap '' INT TERM # Ignore these signals while shutting down

	echo 'Cleaning up...'
	kill -INT 0 # Send C-c to child processes
	wait # for child processes to die
	trap - INT TERM # Remove traps
}

loadenv() {
	echo 'Loading ENV vars'
	. './.env'
}

startapp() {
	echo 'Starting the database...'

	# Run the image and send all output to the log file. Note that, since it's
	# running with --rm, the container does not need to be manually removed.
	$DOCKER run --rm \
		--name="$DOCKER_PG_NAME" \
		-p $DB_PORT:$DB_PORT \
		-e POSTGRES_USER="$DB_USER" \
		-e POSTGRES_PASSWORD="$DB_PASS" \
		-e POSTGRES_DB="$DB_DATABASE" \
		postgres > $DOCKER_LOG_FILE 2>&1 &
	# TODO: error checking?

	echo "postgres db running as the $DOCKER_PG_NAME container"

	echo 'Installing dependencies'
	$NPM i > $NPM_INSTALL_LOG_FILE 2>&1
	if [ $? -ne 0 ]; then
		echo 'Error starting app'
		return 2
	fi

	echo 'Starting the app'
	$NPM start > $NPM_LOG_FILE 2>&1 &
	# TODO: error checking?
}

while true; do
	terminate
	trap 'terminate' INT # retrap since it'll be released by terminate
	loadenv
	startapp
	if [ $? -ne 0 ]; then echo '\033[0;31mFailed run\033[0m'; fi

	echo 'App running, press Ctrl-C to stop'

	# Waits until there's a change in the source directory
	inotifywait -e close_write -r "$SRC_DIR" > /dev/null 2>&1 || break
	echo
done
