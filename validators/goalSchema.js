const Joi = require("Joi");

const gaolSchema = Joi.object({
  goal_name: Joi.string().required(),
  user: Joi.string().required(),
});

module.exports = gaolSchema;
