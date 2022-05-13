// const Joi = require('joi');

// const joiProductId = Joi.object({
//   productId: Joi.number().integer().min(1).required(),
// });

const validateProductId = (req, res, next) => {
  const { productId } = req.body;
  if (!productId) next({ status: 400, message: '"productId" is required' });
  next();
};

module.exports = validateProductId;