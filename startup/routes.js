const express = require("express");
const home = require("../routes/home.js");
const genres = require("../routes/genres.js");
const customers = require("../routes/customers.js");
const movies = require("../routes/movies.js");
const rentals = require("../routes/rentals.js");
const users = require("../routes/users.js");
const auth = require("../routes/auth.js");
const error = require("../middleware/error.js");

module.exports = function (app) {
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
};
