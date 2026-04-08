const Joi = require("joi");

exports.createPropertySchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),

  description: Joi.string().max(500).required(),

  price: Joi.number().min(0).required(),

  location: Joi.string().required(),

  images: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .required()
    .messages({
      "array.min": "At least one image is required",
    }),

  ownerId: Joi.string().hex().length(24).required(),

  rating: Joi.number().min(0).max(5).optional(),

  numReviews: Joi.number().min(0).optional(),
});