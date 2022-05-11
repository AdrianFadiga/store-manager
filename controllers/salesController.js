const salesService = require('../services/salesService');

const getAll = async (req, res) => {
  const allSalles = await salesService.getAll();
  return res.status(200).json(allSalles);
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await salesService.getById(id);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const addSale = async (req, res, next) => {
  try {
    const { quantity, productId } = req.body;
    const result = await salesService.addSale(quantity, productId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  addSale,
};