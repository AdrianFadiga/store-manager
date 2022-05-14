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
  const query = `SELECT sal.date, pro.id AS productId, sap.quantity FROM sales_products AS sap
  INNER JOIN sales as sal
  ON sal.id = sap.sale_id
  INNER JOIN products as pro 
  ON pro.id = sap.product_id
  WHERE sal.id = ?;`;
  const [result] = await connection.execute(query, [id]);
  return result;
};

const addDate = async () => {
  const addDateQuery = 'INSERT INTO sales (date) VALUES (NOW())';
  const [result] = await connection.execute(addDateQuery);
  return result.insertId;
};

const addSale = async (productId, quantity, insertId) => {
  const query = `INSERT INTO sales_products 
  (sale_id, product_id, quantity) VALUES (?, ?, ?)`;
  await connection.execute(query, [insertId, productId, quantity]);  
  return { productId, quantity }; 
};

const updateSale = async (productId, quantity, saleId) => {
  const query = 'UPDATE sales_products SET product_id = ?, quantity = ? WHERE sale_id = ?';
  await connection.execute(query, [productId, quantity, saleId]);
  return { productId, quantity };
};

const deleteSale = async (id) => {
  const query = 'DELETE FROM sales_products WHERE sale_id=?';
  await connection.execute(query, [id]);
  return { status: 204 };
};

module.exports = {
  getAll,
  getById,
  addDate,
  addSale,
  updateSale,
  deleteSale,
};