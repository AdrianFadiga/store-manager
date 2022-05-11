const Joi = require('joi');

const joiQuantity = Joi.array().items(
  Joi.object({
    quantity: Joi.number().integer().min(1).required()
    .messages(
      { 'any.required': '"quantity" is required',
    'number.min': '"quantity" must be greater than or equal to 1' },
      ),
    productId: Joi.number().integer().min(1).required()
    .messages({
      'any.required': '"productId" is required',
      'number.min': '"productId" must be greater than or equal to 1',
    }),
  }),
);

const validateAddSaleArray = (req, res, next) => {
  const { error } = joiQuantity.validate(req.body);
  if (error) {
    const status = (
      error.message.includes('greater')
      ? 422 : 400
    );
    next({ message: error.message, status });
  }
  next();
};

module.exports = validateAddSaleArray;