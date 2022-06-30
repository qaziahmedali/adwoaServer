const Joi = require("Joi");

const onlineSchema = Joi.object({
  meetingLink: Joi.string().required(),
});

module.exports = onlineSchema;
