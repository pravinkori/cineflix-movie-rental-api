const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
    mongoose
        .connect("mongodb://localhost:27017/cineflix")
        .then(() => winston.info("Connected to database..."));
};
