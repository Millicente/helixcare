const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/doctors - get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        department: true,
      },
    });
    res.json({ doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// GET /api/doctors/:id - get single doctor
const getDoctorById = async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        department: true,
      },
    });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.userId },
    });
    if (!doctor) return res.status(404).json({ error: 'Doctor profile not found' });

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: {
        patient: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });
    res.json({ appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json({ message: 'Appointment updated', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// PUT /api/doctors/appointments/:id/notes - add medical notes
const addMedicalNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { notes },
    });
    res.json({ message: 'Notes saved successfully', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { getAllDoctors, getDoctorById, getDoctorAppointments, updateAppointmentStatus, addMedicalNotes };