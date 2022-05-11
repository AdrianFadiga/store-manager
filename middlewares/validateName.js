const Joi = require('joi');

const joiName = Joi.object({
  name: Joi.string().min(5).required(),
});

const validateName = (req, res, next) => {
  const { name } = req.body;
  const { error } = joiName.validate({ name });
  if (error) {
    const status = (
      error.details[0].type === 'string.min'
      ? 422 : 400
    );
    next({ message: error.message, status });
  }
  next();   
};

module.exports = validateName;