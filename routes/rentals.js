const express = require("express");
const mongoose = require("mongoose");
const {
    Rental,
    validate,
    validateRental,
} = require("../models/rentals.model.js");
const { Movie } = require("../models/movies.model.js");
const { Customer } = require("../models/customer.model.js");
const router = express.Router();

router.get("/", async (req, res) => {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
});

router.get("/:id", async (req, res) => {
    const rental = await Rental.findById(req.params.id).select("-__v");

    if (!rental)
        return res
            .status(404)
            .send("The rental with the given ID was not found.");

    res.send(rental);
});

router.post("/", async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) {
        return res.status(400).send("Invalid customer.");
    }

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) {
        return res.status(400).send("Invalid movie.");
    }

    if (movie.numberInStock === 0) {
        return res.status(400).send("Movie not in stock.");
    }

    let newRental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        },
    });
    try {
        const session = await mongoose.startSession();
        session.withTransaction(async () => {
            newRental = await newRental.save();
            movie.numberInStock--;
            movie.save();
            res.send(newRental);
        });
        session.endSession();
    } catch (ex) {
        for (field in err.errors) {
            console.log(err.errors[field].message);
        }
    }
});

module.exports = router;
