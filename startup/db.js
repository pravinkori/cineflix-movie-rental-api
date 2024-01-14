const winston = require("winston");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

module.exports = function () {
    mongoose
        .connect(process.env.DATABASE_URI)
        .then(() => winston.info("Connected to database..."));
};
