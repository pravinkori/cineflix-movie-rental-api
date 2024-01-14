const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const winston = require("winston");
require("winston-mongodb");
const startupDebugger = require("debug")("app:startup");
const databaseDebugger = require("debug")("app:database");
const dotenv = require("dotenv").config();

const app = express();
require("./startup/routes.js")(app);

process.on("uncaughtException", (ex) => {
    console.log("GOT AN UNCAUGHT EXCEPTION.");
    winston.error(ex.message, ex);
    process.exit(1);
});

process.on("unhandledRejection", (ex) => {
    console.log("GOT AN UNHANDLED REJECTION.");
    winston.error(ex.message, ex);
    process.exit(1);
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
        new winston.transports.File({
            filename: "logfile.log",
            level: "info",
        }),
    ],
});

winston.add(
    new winston.transports.MongoDB({
        db: "mongodb://localhost:27017/cineflix",
        level: "info",
        metaKey: "meta",
    })
);

// Check if jwtSecret is defined in the configuration
if (!config.get("jwtSecret")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined");
    process.exit(1);
}

mongoose
    .connect("mongodb://localhost:27017/cineflix")
    .then(() => console.log("Connected to database..."))
    .catch((err) => console.error("could not connect to database"));

// Middleware setup:
// 'express.json()' parses incoming JSON payloads.
app.use(express.json());

// 'express.urlencoded({ extended: true })' parses URL-encoded data from form submissions.
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory using Express middleware.
app.use(express.static("public"));

// 'helmet()' applies various HTTP headers for improved security.
app.use(helmet());

// Enable 'morgan' logging in development environment and log status.
if (app.get("env") === "development") {
    app.use(morgan("dev"));
    startupDebugger("Morgan logger enabled...");
    // databaseDebugger("Connected to database...");
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});
