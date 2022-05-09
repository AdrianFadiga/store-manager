const productsService = require('../services/productsService');

const getAll = async (req, res) => {
  const allProducts = await productsService.getAll();
  return res.status(200).json(allProducts);
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productById = await productsService.getById(id);
    return res.status(200).json(productById);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
};