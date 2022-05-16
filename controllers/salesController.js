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
    const { body } = req;
    const response = await salesService.addSale(body);
    return res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

const updateSale = async (req, res) => {
  const { productId, quantity } = req.body[0];
  const { id } = req.params;
  const result = await salesService.updateSale(productId, quantity, id);
  return res.status(200).json(result);
};

const deleteSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    await salesService.deleteSale(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  addSale,
  updateSale,
  deleteSale,
};