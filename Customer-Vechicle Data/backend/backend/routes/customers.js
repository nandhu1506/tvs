const express = require('express');
const router = express.Router();
const { getCustomers, addCustomer, getCustomerById, updateCustomer } = require('../controllers/customersController');
const authenticate = require('../middleware/auth')


router.get('/', authenticate, getCustomers);
router.post('/', authenticate, addCustomer);

router.get('/:id', authenticate, getCustomerById);

router.put('/:id', authenticate, updateCustomer);

module.exports = router;