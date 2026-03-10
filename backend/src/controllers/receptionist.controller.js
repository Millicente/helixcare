const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/receptionist/appointments - get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        doctor: {
          include: {
            user: { select: { name: true } },
            department: true,
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

// PUT /api/receptionist/appointments/:id - update appointment status
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

module.exports = { getAllAppointments, updateAppointmentStatus };