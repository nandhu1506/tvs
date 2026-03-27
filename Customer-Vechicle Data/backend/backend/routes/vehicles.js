const express = require('express');
const router = express.Router();
const { getVehicles } = require('../controllers/vehiclesController');
const { getVehicleById } = require('../controllers/vehiclesController');
const { updateVehicle } = require('../controllers/vehiclesController');
const { getVehiclesByCustomer } = require('../controllers/vehiclesController');
const { addVehicle } = require('../controllers/vehiclesController');
const { deleteVehicle } = require('../controllers/vehiclesController');
const authenticate = require('../middleware/auth')


router.get('/', authenticate, getVehicles);
router.get('/customer/:id', authenticate, getVehiclesByCustomer);
router.post('/', authenticate, addVehicle);
router.get('/:id', authenticate, getVehicleById);
router.put('/:id', authenticate, updateVehicle);
router.delete('/:id', authenticate, deleteVehicle);

module.exports = router;