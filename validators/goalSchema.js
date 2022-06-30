const Joi = require("joi");

const gaolSchema = Joi.object({
  goal_name: Joi.string().required(),
  user: Joi.string().required(),
});

module.exports = gaolSchema;
