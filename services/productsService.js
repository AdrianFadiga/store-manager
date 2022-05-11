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
};

module.exports = {
  getAll,
  getById,
  addProduct,
};