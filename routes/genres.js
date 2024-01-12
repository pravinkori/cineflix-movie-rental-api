const express = require("express");
const { Genre, validateGenre } = require("../models/genres.model.js");
const auth = require("../middleware/auth.js");
const admin = require("../middleware/admin.js");
const router = express.Router();

router.get("/", async (req, res) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
});

router.get("/:id", async (req, res) => {
    const genreByID = await Genre.findById(req.params.id);

    if (!genreByID) {
        return res.status(404).send("The genre with given ID does not exist");
    }

    res.send(genreByID);
});

router.post("/", auth, async (req, res) => {
    const { error } = validateGenre(req.body);

    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    let newGenre = new Genre({
        name: req.body.name,
    });
    newGenre = await newGenre.save();
    res.send(newGenre);
});

router.put("/:id", async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const updateGenreByID = await Genre.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
        },
        {
            new: true,
        }
    );

    if (!updateGenreByID) {
        return res.status(404).send("The genre with given ID was not found");
    }

    res.send(updateGenreByID);
});

router.delete("/:id", [auth, admin], async (req, res) => {
    const deleteGenreByID = await Genre.findByIdAndDelete(req.params.id);

    if (!deleteGenreByID) {
        return res.status(404).send("The genre with given ID was not found");
    }

    res.send(deleteGenreByID);
});

module.exports = router;
