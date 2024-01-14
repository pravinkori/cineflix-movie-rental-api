const dotenv = require("dotenv").config();
const winston = require("winston");
require("winston-mongodb");

exports.module = function () {
    /**
     * Global event handlers for uncaught exceptions and unhandled rejections.
     * Logs the exception details using Winston and exits the process with a status code of 1.
     */

    // Handling uncaught exceptions
    process.on("uncaughtException", (ex) => {
        console.log("GOT AN UNCAUGHT EXCEPTION.");
        winston.error(ex.message, ex);
        process.exit(1);
    });

    // Handling unhandled promise rejections
    process.on("unhandledRejection", (ex) => {
        console.log("GOT AN UNHANDLED REJECTION.");
        winston.error(ex.message, ex);
        process.exit(1);
    });

    /**
     * Configuring Winston logger for logging in an application.
     * The logger is set to log to a file ('logfile.log') and a MongoDB database ('cineflix').
     */

    // Creating a Winston logger instance
    const logger = winston.createLogger({
        level: "info",
        format: winston.format.json(),
        defaultMeta: { service: "user-service" },
        // Adding a transport to log to a file ('logfile.log')
        transports: [
            new winston.transports.File({
                filename: "logfile.log",
                level: "info",
            }),
        ],
    });

    // Adding a MongoDB transport to log to a MongoDB database ('cineflix')
    winston.add(
        new winston.transports.MongoDB({
            db: DATABASE_URI,
            level: "info",
            metaKey: "meta",
        })
    );
};
