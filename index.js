const express = require("express");
const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const dotenv = require("dotenv").config();

const app = express();
require("./startup/logging.js");
require("./startup/routes.js")(app);
require("./startup/db.js")();

// Check if jwtSecret is defined in the configuration
if (!config.get("jwtSecret")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined");
    process.exit(1);
}

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
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});
