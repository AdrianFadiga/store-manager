const salesModel = require('../models/salesModel');

const objGenerator = (message, status) => ({
  message,
  status,
});

const getAll = async () => {
  const allSales = await salesModel.getAll();
  return allSales; 
};

const getById = async (id) => {
  const result = await salesModel.getById(id);
  if (!result.length) throw objGenerator('Sale not found', 404);
  return result;
};

const addSale = async (quantity, productId) => {
  if (quantity <= 0) throw objGenerator('"quantity" must be greater than or equal to 1', 422);  
  if (!productId) throw objGenerator('"productId" is required', 400);
  if (!quantity) throw objGenerator('"quantity" is required', 400);
};

module.exports = {
  getAll,
  getById,
  addSale,
};