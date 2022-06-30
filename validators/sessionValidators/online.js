const Joi = require("joi");

const onlineSchema = Joi.object({
  meetingLink: Joi.string().required(),
});

module.exports = onlineSchema;
