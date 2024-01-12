const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const auth = require("../middleware/auth.js");
const { User, validateUser } = require("../models/users.model.js");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

router.post("/", async (req, res) => {
    // Validating user input using the 'validateUser' function
    const { error } = validateUser(req.body);

    // If there is an error in the validation, return a 404 status with the error message
    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    // Checking if the user with the provided email already exists in the database
    let user = await User.findOne({
        email: req.body.email,
    });

    // If the user already exists, return a 400 status with a relevant message
    if (user) {
        return res.status(400).send("User already registered");
    }

    // Creating a new User instance with selected properties from the request body
    user = new User(_.pick(req.body, ["name", "email", "password"]));

    // Generating a salt and hashing the user's password for enhanced security
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        // Saving the new user to the database
        newUser = await user.save();

        const token = user.generateAuthToken();

        res.header("x-auth-token", token);

        // Sending a response with selected properties of the newly registered user
        res.send(_.pick(newUser, ["_id", "name", "email"]));
    } catch (err) {
        // Handling any errors that occur during the save operation
        for (field in err.errors) {
            console.log(err.errors[field].message);
        }
    }
});

module.exports = router;
