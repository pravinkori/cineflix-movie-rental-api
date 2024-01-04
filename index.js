const express = require("express");
const Joi = require("joi");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

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

app.get("/", (req, res) => {
    res.send("Welcome to cineflix!");
});

app.get("/api/genres", (res, req) => {
    res.send(genres);
});

app.get("/api/genres/:id", (res, req) => {
    const genreByID = genres.find(
        (genre) => genre.id === parseInt(req.params.id)
    );

    if (!genreByID) {
        return res.status(404).send("The genre with given ID does not exist");
    }

    res.send(genreByID);
});

app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});
