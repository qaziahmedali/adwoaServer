const Joi = require("Joi");

const bookingSchema = Joi.object({
  sessionId: Joi.string().required(),
  trainerId: Joi.string().required(),
});

module.exports = bookingSchema;
