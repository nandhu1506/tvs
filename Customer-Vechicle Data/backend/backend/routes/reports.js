const express = require('express');
const authenticate = require('../middleware/auth');
const { getVehicleReport, downloadVehicleReportExcel, getCustomerReport, downloadCustomerReportExcel, getVehiclesByCustomerReport, downloadVehiclesByCustomerExcel } = require('../controllers/reportController');
const router = express.Router()



router.get('/vehicles', authenticate, getVehicleReport);
router.get('/vehicles/excel', authenticate, downloadVehicleReportExcel);

router.get('/customers', authenticate, getCustomerReport);
router.get('/customers/excel', authenticate, downloadCustomerReportExcel);

router.get('/vehiclesbycustomer/:customerId', authenticate, getVehiclesByCustomerReport);
router.get('/vehiclesbycustomer/:customerId/excel', authenticate, downloadVehiclesByCustomerExcel);


module.exports = router;