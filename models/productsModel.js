const connection = require('./connection');

const getAll = async () => {
  const query = 'SELECT * FROM products';
  const [allProducts] = await connection.execute(query);
  return allProducts;
};

const getById = async (id) => {
  const query = 'SELECT * FROM products WHERE id=?';
  const [result] = await connection.execute(query, [id]);
  if (!result) return null;
  return result[0];
};

module.exports = {
  getAll,
  getById,
};