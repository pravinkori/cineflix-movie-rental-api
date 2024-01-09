const express = require("express");
const { Customer, validateCustomer } = require("../models/customer.model.js");
const mongoose = require("mongoose");
const Joi = require("joi");
const router = express.Router();

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
        return res.status(404).send(error.details[0].message);
    }

    let newCustomer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    });
    try {
        newCustomer = await newCustomer.save();
        res.send(newCustomer);
    } catch (err) {
        for (field in err.errors) {
            console.log(err.errors[field].message);
        }
    }
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

module.exports = router;
