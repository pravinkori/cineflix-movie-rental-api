const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const passwordComplexity = require("joi-password-complexity");
const { User } = require("../models/users.model.js");
const router = express.Router();

router.post("/", async (req, res) => {
    // Validating user input using the 'validateUser' function
    const { error } = validateUserRequest(req.body);

    // If there is an error in the validation, return a 404 status with the error message
    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    // Checking if the user with the provided email already exists in the database
    let user = await User.findOne({
        email: req.body.email,
    });

    // If the user does not exist, return a 401 status
    if (!user) {
        return res.status(400).send("Invalid email or password");
    }

    // Compare the password from request body
    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    // If the password is invalid, return a 401 status
    if (!validPassword) {
        return res.status(400).send("Invalid email or password");
    }

    const token = user.generateAuthToken();
    res.send(token);
    // res.send({
    //     token: token,
    //     // user: `Welcome to cineflix! ${user.name}`,
    //     // success: true,
    // });
});

const complexityOptions = {
    min: 8,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
};

function validateUserRequest(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email().required(),
        password: passwordComplexity(complexityOptions).required(),
    });
    return schema.validate(req);
}

module.exports = router;
