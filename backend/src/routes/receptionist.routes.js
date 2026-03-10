const express = require('express');
const { getAllAppointments, updateAppointmentStatus } = require('../controllers/receptionist.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('RECEPTIONIST', 'ADMIN'));

router.get('/appointments', getAllAppointments);
router.put('/appointments/:id', updateAppointmentStatus);

module.exports = router;