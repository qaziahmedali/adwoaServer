const Joi = require("joi");

const fitnessSchema = Joi.object({
  fitness_level: Joi.array().required(),
  fitness_goal: Joi.array().required(),
  services_offered: Joi.array().required(),
});

module.exports = fitnessSchema;
