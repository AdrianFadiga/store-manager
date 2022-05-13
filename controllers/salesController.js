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

const addSale = async (req, res) => {
    const { body } = req;
    const response = await salesService.addSale(body);
    return res.status(201).json(response);
};

module.exports = {
  getAll,
  getById,
  addSale,
};