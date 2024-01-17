const express = require("express");
const winston = require("winston");
const helmet = require("helmet");
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const dotenv = require("dotenv").config();

const app = express();
require("./startup/logging.js");
require("./startup/routes.js")(app);
require("./startup/db.js")();
require("./startup/config.js")();

// Middleware setup:
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
}

winston.add(new winston.transports.Console());

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    winston.info(`listening on port http://localhost:${port}`);
});

module.exports = server;
