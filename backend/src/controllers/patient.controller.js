const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/patients/profile - get own patient profile
const getProfile = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        },
      },
    });
    if (!patient) return res.status(404).json({ error: 'Patient profile not found' });
    res.json({ patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// PUT /api/patients/profile - update own patient profile
const updateProfile = async (req, res) => {
  try {
    const { dateOfBirth, bloodType, allergies, emergencyContact } = req.body;
    const patient = await prisma.patient.update({
      where: { userId: req.user.userId },
      data: { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, bloodType, allergies, emergencyContact },
    });
    res.json({ message: 'Profile updated successfully', patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// GET /api/patients/appointments - get own appointments
const getMyAppointments = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.userId },
    });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: {
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

// POST /api/patients/appointments - book appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, scheduledAt, reason } = req.body;

    if (!doctorId || !scheduledAt) {
      return res.status(400).json({ error: 'Doctor and date are required' });
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.userId },
    });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        scheduledAt: new Date(scheduledAt),
        reason,
        status: 'PENDING',
      },
      include: {
        doctor: {
          include: {
            user: { select: { name: true } },
            department: true,
          },
        },
      },
    });

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { getProfile, updateProfile, getMyAppointments, bookAppointment };