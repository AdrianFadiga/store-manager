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

module.exports = {
  getAll,
  getById,
};