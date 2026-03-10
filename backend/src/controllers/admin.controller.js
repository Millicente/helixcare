const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// GET /api/admin/departments
const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json({ departments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// POST /api/admin/departments
const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Department name is required' });
    const department = await prisma.department.create({
      data: { name, description },
    });
    res.status(201).json({ message: 'Department created', department });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// POST /api/admin/register-doctor
const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, licenseNumber, departmentId } = req.body;
    if (!name || !email || !password || !specialization || !licenseNumber || !departmentId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name, email, password: hashed, role: 'DOCTOR',
        doctor: {
          create: { specialization, licenseNumber, departmentId },
        },
      },
    });

    res.status(201).json({ message: 'Doctor registered successfully', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// DELETE /api/admin/departments/:id
const deleteDepartment = async (req, res) => {
  try {
    await prisma.department.delete({ where: { id: req.params.id } });
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { getAllUsers, getDepartments, createDepartment, registerDoctor, deleteUser, deleteDepartment };