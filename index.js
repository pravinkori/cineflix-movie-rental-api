const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const databaseDebugger = require("debug")("app:database");
const dotenv = require("dotenv").config();
const home = require("./routes/home.js");
const genres = require("./routes/genres.js");
const app = express();

// Middleware setup:
// 'express.json()' parses incoming JSON payloads.
app.use(express.json());

// 'express.urlencoded({ extended: true })' parses URL-encoded data from form submissions.
app.use(express.urlencoded({ extended: true }));

// 'helmet()' applies various HTTP headers for improved security.
app.use(helmet());

// Routes setup:
// '/api/genres' endpoint is handled by the 'genres' router.
app.use("api/genres", genres);

// '/' endpoint is handled by the 'home' router.
app.use("/", home);

// Enable 'morgan' logging in development environment and log status.
if (app.get("env") === "development") {
    app.use(morgan("dev"));
    startupDebugger("Morgan logger enabled...");
    databaseDebugger("Connected to database...");
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});
