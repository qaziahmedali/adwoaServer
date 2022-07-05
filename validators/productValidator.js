const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  seller: Joi.string().required(),
  location: Joi.string().required(),
  payment: Joi.string().required(),
  des: Joi.string().required(),
});

module.exports = productSchema;
