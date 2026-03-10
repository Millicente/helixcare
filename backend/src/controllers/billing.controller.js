const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/billing - get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await prisma.billing.findMany({
      include: {
        patient: { include: { user: { select: { name: true } } } },
        appointment: { include: { doctor: { include: { user: { select: { name: true } } } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ bills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// POST /api/billing - create a bill
const createBill = async (req, res) => {
  try {
    const { appointmentId, amount, description } = req.body;
    if (!appointmentId || !amount) return res.status(400).json({ error: 'Appointment and amount are required' });

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    const existing = await prisma.billing.findUnique({ where: { appointmentId } });
    if (existing) return res.status(400).json({ error: 'Bill already exists for this appointment' });

    const bill = await prisma.billing.create({
      data: {
        appointmentId,
        patientId: appointment.patientId,
        amount: parseFloat(amount),
        description,
      },
      include: {
        patient: { include: { user: { select: { name: true } } } },
        appointment: true,
      },
    });
    res.status(201).json({ message: 'Bill created', bill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// PUT /api/billing/:id - update bill status
const updateBillStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bill = await prisma.billing.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json({ message: 'Bill updated', bill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// GET /api/billing/patient - get own bills (for patient)
const getMyBills = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({ where: { userId: req.user.userId } });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const bills = await prisma.billing.findMany({
      where: { patientId: patient.id },
      include: {
        appointment: { include: { doctor: { include: { user: { select: { name: true } } } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ bills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { getAllBills, createBill, updateBillStatus, getMyBills };