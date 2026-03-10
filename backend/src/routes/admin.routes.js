const express = require('express');
const { getAllUsers, getDepartments, createDepartment, registerDoctor, deleteUser, deleteDepartment } = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.post('/register-doctor', registerDoctor);
router.delete('/departments/:id', deleteDepartment);

module.exports = router;