const Joi = require("joi");

exports.createBookingSchema = Joi.object({


  userName: Joi.string().optional(),

  propertyId: Joi.string().hex().length(24).required(),

  propertyTitle: Joi.string().optional(),

  startDate: Joi.date().required(),

  endDate: Joi.date()
    .greater(Joi.ref("startDate"))
    .required()
    .messages({
      "date.greater": "End date must be greater than start date",
    }),

  totalPrice: Joi.number().min(0),

  status: Joi.string()
    .valid("pending", "confirmed", "cancelled")
    .optional(),

  paymentStatus: Joi.string()
    .valid("pending", "paid", "failed")
    .optional(),

  notes: Joi.string().max(300).optional(),

  isDeleted: Joi.boolean().optional(),
});