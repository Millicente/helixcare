const express = require('express');
const { getAllDoctors, getDoctorById, getDoctorAppointments, updateAppointmentStatus, addMedicalNotes } = require('../controllers/doctor.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getAllDoctors);
router.get('/appointments', restrictTo('DOCTOR'), getDoctorAppointments);
router.put('/appointments/:id', restrictTo('DOCTOR'), updateAppointmentStatus);
router.get('/:id', getDoctorById);
router.put('/appointments/:id/notes', restrictTo('DOCTOR'), addMedicalNotes);

module.exports = router;