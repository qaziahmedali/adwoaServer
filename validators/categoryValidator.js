const Joi = require("Joi");

const categorySchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});

module.exports = categorySchema;
