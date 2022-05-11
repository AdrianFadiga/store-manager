const Joi = require('joi');

const joiProductId = Joi.array().items(
  Joi.object({
    productId: Joi.number().integer().min(1).required(),
  }),
);

const validateProductIdArray = (req, res, next) => {
  const { error } = joiProductId.validate(req.body);
  if (error) {
    next({ message: '"productId" is required', status: 400 });
  }
  next();
};

module.exports = validateProductIdArray;