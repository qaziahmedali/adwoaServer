const Joi = require("joi");

const bookingSchema = Joi.object({
  sessionId: Joi.string().required(),
  trainerId: Joi.string().required(),
});

module.exports = bookingSchema;
