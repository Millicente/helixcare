const express = require('express');
const { getAllBills, createBill, updateBillStatus, getMyBills } = require('../controllers/billing.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/patient', restrictTo('PATIENT'), getMyBills);
router.get('/', restrictTo('RECEPTIONIST', 'ADMIN'), getAllBills);
router.post('/', restrictTo('RECEPTIONIST', 'ADMIN'), createBill);
router.put('/:id', restrictTo('RECEPTIONIST', 'ADMIN'), updateBillStatus);

module.exports = router;