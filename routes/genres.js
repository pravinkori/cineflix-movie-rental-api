const express = require("express");
const Joi = require("joi");
const router = express.Router();

const genres = [
    { id: 1, name: "action" },
    { id: 2, name: "comedy" },
    { id: 3, name: "drama" },
    { id: 4, name: "sci-fi" },
    { id: 5, name: "fantasy" },
];

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
    });
    return schema.validate(genre);
}

router.get("/api/genres", (res, req) => {
    res.send(genres);
});

router.get("/api/genres/:id", (res, req) => {
    const genreByID = genres.find(
        (genre) => genre.id === parseInt(req.params.id)
    );

    if (!genreByID) {
        return res.status(404).send("The genre with given ID does not exist");
    }

    res.send(genreByID);
});

router.post("/api/genres", (req, res) => {
    const { error } = validateGenre(req.body);

    if (error) {
        return res.status(404).send(result.error.details[0].message);
    }

    const newGenre = {
        id: genres.length + 1,
        name: req.body.name,
    };
    genres.push(newGenre);
    res.send(newGenre);
});

router.put("/api/genres/:id", (req, res) => {
    const updateGenreByID = courses.find(
        (genre) => genre.id === parseInt(req.params.id)
    );

    if (!updateGenreByID) {
        return res.status(404).send("The genre with given ID was not found");
    }

    const { error } = validateCourse(req.body);

    if (error) {
        return res.status(400).send(result.error.details[0].message);
    }

    updateGenreByID.name = req.body.name;
    res.send(updateGenreByID);
});

router.delete("/api/genres/:id", (req, res) => {
    const deleteGenreByID = genres.find(
        (genre) => genre.id === parseInt(req.params.id)
    );
    if (!deleteGenreByID) {
        return res.status(404).send("The genre with given ID was not found");
    }

    const index = genres.indexOf(deleteGenreByID);
    genres.splice(index, 1);

    res.send(deleteGenreByID);
});

module.exports = router;
