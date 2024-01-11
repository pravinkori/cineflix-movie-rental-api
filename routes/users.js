const express = require("express");
const { User, validateUser } = require("../models/users.model.js");
const router = express.Router();

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

    // Creating a new User instance with the provided data
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    try {
        // Saving the new user to the database
        newUser = await user.save();

        // Sending the new user details as a response
        res.send(newUser);
    } catch (err) {
        // Handling any errors that occur during the save operation
        for (field in err.errors) {
            console.log(err.errors[field].message);
        }
    }
});

module.exports = router;
