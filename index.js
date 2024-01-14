const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const databaseDebugger = require("debug")("app:database");
const dotenv = require("dotenv").config();
const home = require("./routes/home.js");
const genres = require("./routes/genres.js");
const customers = require("./routes/customers.js");
const movies = require("./routes/movies.js");
const rentals = require("./routes/rentals.js");
const users = require("./routes/users.js");
const auth = require("./routes/auth.js");
const error = require("./middleware/error.js");

const app = express();

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

// Routes setup:
// '/api/genres' endpoint is handled by the 'genres' router.
app.use("/api/genres", genres);
// '/api/customers' endpoint is handled by the 'customers' router.
app.use("/api/customers", customers);
// '/api/movies' endpoint is handled by the 'movies' router.
app.use("/api/movies", movies);
// '/api/rentals' endpoint is handled by the 'rentals' router.
app.use("/api/rentals", rentals);
// '/api/users' endpoint is handled by the 'users' router.
app.use("/api/users", users);
// '/api/users' endpoint is handled by the 'users' router.
app.use("/api/auth", auth);
// '/' endpoint is handled by the 'home' router.
app.use("/", home);

// Registering an error-handling middleware
app.use(error);

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
