const productsModel = require('../models/productsModel');

const objGenerator = (message, status) => ({
  message,
  status,
});

const getAll = async () => {
  const allProducts = await productsModel.getAll();
  return allProducts;
};

const getById = async (id) => {
  const result = await productsModel.getById(id);
  if (!result) throw objGenerator('Product not found', 404);
  return result;
};

const addProduct = async (name, quantity) => {
  if (!name) throw objGenerator('"name" is required', 400);
  if (!quantity) throw objGenerator('"quantity" is required', 400);
};

module.exports = {
  getAll,
  getById,
  addProduct,
};