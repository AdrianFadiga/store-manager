const Joi = require('joi');

const joiQuantity = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

const validateQuantity = (req, res, next) => {
  const { quantity } = req.body;
  const { error } = joiQuantity.validate({ quantity });
  if (error) {
  const status = (
    error.details[0].type === 'number.min'
      ? 422 : 400
  );
  next({ message: error.message, status });
}
  next();   
};

module.exports = validateQuantity;