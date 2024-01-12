const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const passwordComplexity = require("joi-password-complexity");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 5,
        maxlength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024,
    },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
        },
        config.get("jwtSecret")
    );
    return token;
};

const User = mongoose.model("User", userSchema);

const complexityOptions = {
    min: 8,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
};

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: passwordComplexity(complexityOptions).required(),
    });
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
