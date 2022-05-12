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

const addProduct = async (req, res, next) => {
  try {
    const { name, quantity } = req.body;
    const result = await productsService.addProduct(name, quantity);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, quantity } = req.body;
    const result = await productsService.updateProduct(id, name, quantity);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
  const { id } = req.params;
  await productsService.deleteProduct(id);
  return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAll,
  getById,
  addProduct,
  updateProduct,
  deleteProduct,
};