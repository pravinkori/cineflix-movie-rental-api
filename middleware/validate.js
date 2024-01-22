const validate = (validatorFunction) => {
    return (req, res, next) => {
        const { error } = validatorFunction(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        next();
    };
};

module.exports = validate;
