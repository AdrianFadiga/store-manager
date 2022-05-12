const router = require('express').Router();
const productsController = require('../controllers/productsController');
const middleware = require('../middlewares');

router.get('/:id', productsController.getById);

router.post('/', middleware.validateName, 
middleware.validateQuantity, 
 productsController.addProduct);

 router.put('/:id', middleware.validateName, middleware.validateQuantity,
 productsController.updateProduct);

router.get('/', productsController.getAll);

module.exports = router;