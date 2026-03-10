const express = require('express');
const { getProfile, updateProfile, getMyAppointments, bookAppointment } = require('../controllers/patient.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('PATIENT'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/appointments', getMyAppointments);
router.post('/appointments', bookAppointment);

module.exports = router;