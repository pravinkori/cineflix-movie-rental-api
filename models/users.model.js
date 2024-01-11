const Joi = require("joi");
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

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).max(255).required(),
    });
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
