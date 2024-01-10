const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genres.model.js");

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 5,
        maxlength: 50,
        trim: true,
    },
    genre: {
        type: genreSchema,
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
});

const Movie = mongoose.model("Movie", moviesSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        genreID: Joi.string().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
    });
    return schema.validate(movie);
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;
