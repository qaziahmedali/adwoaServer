const Joi = require("joi");

const professionSchema = Joi.object({
  experience_year: Joi.string().required(),
  experience_note: Joi.string().required(),
  qualification: Joi.array().required(),
});

module.exports = professionSchema;
