const Joi = require("Joi");

const physicalSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});

module.exports = physicalSchema;
