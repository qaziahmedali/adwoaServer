const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  seller: Joi.string().required(),
  location: Joi.string().required(),
  payment: Joi.string().required(),
  des: Joi.string().required(),
});
module.exports = categorySchema;
