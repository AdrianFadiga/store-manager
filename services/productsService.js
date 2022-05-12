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
  const result = await productsModel.getByName(name);
  if (result) throw objGenerator('Product already exists', 409);
  const addToDB = await productsModel.addProduct(name, quantity);
  return addToDB;
};

const updateProduct = async (id, name, quantity) => {
  const result = await productsModel.getById(id);
  if (!result) throw objGenerator('Product not found', 404);
  const updateDB = await productsModel.updateProduct(id, name, quantity);
  return updateDB;
};

const deleteProduct = async (id) => {
  const registeredId = await getById(id);
  if (!registeredId) throw objGenerator('Product not found', 404);
  const response = await productsModel.deleteProduct(id);
  return response;
};

module.exports = {
  getAll,
  getById,
  addProduct,
  updateProduct,
  deleteProduct,
};