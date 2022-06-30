const Joi = require("Joi");

const serviceSchema = Joi.object({
  service_name: Joi.string().required(),
  user: Joi.string().required(),
});

module.exports = serviceSchema;
