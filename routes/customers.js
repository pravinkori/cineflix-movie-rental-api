const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const router = express.Router();

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    isGold: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
        min: 10,
        max: 10,
    },
});

const Customer = mongoose.model("Customer", customerSchema);

router.get("/", async (req, res) => {
    const customers = await Customer.find().sort("name");
    res.send(customers);
});

router.get("/:id", async (req, res) => {
    const customerByID = await Customer.findById(req.params.id);

    if (!customerByID) {
        return res.status(404).send("The genre with given ID does not exist");
    }

    res.send(customerByID);
});

router.post("/", async (req, res) => {
    const { error } = validateCustomer(req.body);

    if (error) {
        return res.status(404).send(result.error.details[0].message);
    }

    let newCustomer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    });
    newCustomer = await newCustomer.save();
    res.send(newCustomer);
});

router.put("/:id", async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) {
        return res.status(400).send(result.error.details[0].message);
    }

    const updateCustomerByID = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            phone: req.body.phone,
        },
        {
            new: true,
        }
    );

    if (!updateCustomerByID) {
        return res.status(404).send("The genre with given ID was not found");
    }

    res.send(updateCustomerByID);
});

router.delete("/:id", async (req, res) => {
    const deleteCustomerByID = await Customer.findByIdAndDelete(req.params.id);

    if (!deleteCustomerByID) {
        return res.status(404).send("The genre with given ID was not found");
    }

    res.send(deleteCustomerByID);
});

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
    });
    return schema.validate(customer);
}

module.exports = router;
