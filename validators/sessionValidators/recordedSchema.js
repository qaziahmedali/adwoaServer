const Joi = require("Joi");

const recordedSchema = Joi.object({
  videoLink: Joi.string().required(),
  recordCategory: Joi.string().required(),
  videoTitle: Joi.string().required(),
  no_of_play: Joi.string().required(),
  desc: Joi.string().required(),
});

module.exports = recordedSchema;
