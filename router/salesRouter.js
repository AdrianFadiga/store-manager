const router = require('express').Router();
const salesController = require('../controllers/salesController');

router.get('/:id', salesController.getById);

router.get('/', salesController.getAll);

module.exports = router;