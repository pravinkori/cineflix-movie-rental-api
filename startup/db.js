const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");
const dotenv = require("dotenv").config();

module.exports = function () {
    const db = process.env.TEST_DATABASE_URI;
    mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
};
