const connection = require('./connection');

const toCamelCase = (salesResponse) => ({
    saleId: salesResponse.sale_id,
    date: salesResponse.date,
    productId: salesResponse.product_id,
    quantity: salesResponse.quantity,
  });

const getAll = async () => {
  const query = `SELECT sal.id AS sale_id, 
  sal.date, pro.id AS product_id, sap.quantity AS quantity FROM sales_products AS sap
  INNER JOIN sales AS sal
  ON sal.id = sap.sale_id
  INNER JOIN products AS pro
  ON pro.id = sap.product_id;`;
  const [allProducts] = await connection.execute(query);
  return allProducts.map(toCamelCase);
};

const getById = async (id) => {
  const query = `SELECT sal.date, pro.id AS product_id, sap.quantity FROM sales_products AS sap
  INNER JOIN sales as sal
  ON sal.id = sap.sale_id
  INNER JOIN products as pro 
  ON pro.id = sap.product_id
  WHERE sal.id = ?;`;
  const [result] = await connection.execute(query, [id]);
  return result.map(toCamelCase);
};

module.exports = {
  getAll,
  getById,
};