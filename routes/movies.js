const express = require("express");
const { Movie, validateMovie } = require("../models/movies.model.js");
const { Genre } = require("../models/genres.model.js");
const router = express.Router();

router.get("/", async (req, res) => {
    const movies = await Movie.find().sort("name");
    res.send(movies);
});

router.get("/:id", async (req, res) => {
    const movieByID = await Movie.findById(req.params.id);

    if (!movieByID) {
        return res.status(404).send("The movie with given ID does not exist");
    }

    res.send(movieByID);
});

router.post("/", async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreID);
    if (!genre) {
        return res.status(404).send("Invalid genre ID");
    }

    let newMovie = new Movie({
        title: req.body.titile,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });

    try {
        newMovie = await newMovie.save();
        res.send(newMovie);
    } catch (err) {
        for (field in err.errors) {
            console.log(err.errors[field].message);
        }
    }
});

router.put("/:id", async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findById(req.body.genreID);
    if (!genre) {
        return res.status(404).send("Invalid genre ID");
    }

    const updateMovieByID = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name,
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        },
        {
            new: true,
        }
    );

    if (!updateMovieByID) {
        return res.status(404).send("The movie with given ID was not found");
    }

    res.send(updateMovieByID);
});

router.delete("/:id", async (req, res) => {
    const deleteMovieByID = await Customer.findByIdAndDelete(req.params.id);

    if (!deleteMovieByID) {
        return res.status(404).send("The movie with given ID was not found");
    }

    res.send(deleteMovieByID);
});

module.exports = router;
