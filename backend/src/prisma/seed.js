const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding HelixCare...');
  const hash = (pw) => bcrypt.hashSync(pw, 10);

  const departments = [
    { name: 'Emergency Department (ED)', description: 'Immediate treatment for acute illnesses and injuries' },
    { name: 'Intensive Care Unit (ICU)', description: 'Specialized 24/7 care for critically ill patients' },
    { name: 'Operating Theatre (OT)', description: 'Facility for performing surgical procedures' },
    { name: 'Cardiology', description: 'Diagnosis and treatment of heart and blood vessel disorders' },
    { name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents' },
    { name: 'Obstetrics and Gynecology (OB-GYN)', description: 'Pregnancy, childbirth, and female reproductive health' },
    { name: 'Neurology', description: 'Treatment of nervous system disorders' },
    { name: 'Orthopedics', description: 'Care for musculoskeletal injuries and diseases' },
    { name: 'Oncology', description: 'Cancer diagnosis and treatment' },
    { name: 'Gastroenterology', description: 'Digestive system disorder treatment' },
    { name: 'ENT (Ear, Nose, and Throat)', description: 'Specialized care for ear, nose, and throat issues' },
    { name: 'Radiology/Imaging', description: 'Produces diagnostic images like X-rays, CT scans, and MRIs' },
    { name: 'Pathology/Laboratory', description: 'Analyzes blood, tissue, and other samples' },
    { name: 'Pharmacy', description: 'Compounds and dispenses medications' },
    { name: 'Rehabilitation Services', description: 'Physical therapy and recovery services' },
    { name: 'Outpatient Department (OPD)', description: 'Consultations and treatments not requiring overnight stay' },
    { name: 'Medical Records (HIM)', description: 'Manages patient health information and documentation' },
    { name: 'Human Resources (HR)', description: 'Manages hospital staffing and employee training' },
    { name: 'Billing & Finance', description: 'Handles patient billing and insurance' },
    { name: 'General Medicine', description: 'General health and primary care' },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
  }
  console.log('✅ Departments created');

  await prisma.user.upsert({
    where: { email: 'admin@helixcare.com' },
    update: {},
    create: { name: 'System Admin', email: 'admin@helixcare.com', password: hash('admin123'), role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'reception@helixcare.com' },
    update: {},
    create: { name: 'Sarah Thompson', email: 'reception@helixcare.com', password: hash('reception123'), role: 'RECEPTIONIST' },
  });

  const cardiology = await prisma.department.findUnique({ where: { name: 'Cardiology' } });
  const general = await prisma.department.findUnique({ where: { name: 'General Medicine' } });
  const neurology = await prisma.department.findUnique({ where: { name: 'Neurology' } });

  const doc1 = await prisma.user.upsert({
    where: { email: 'dr.james@helixcare.com' },
    update: {},
    create: { name: 'Dr. Marcus James', email: 'dr.james@helixcare.com', password: hash('doctor123'), role: 'DOCTOR' },
  });
  await prisma.doctor.upsert({
    where: { userId: doc1.id },
    update: {},
    create: { userId: doc1.id, departmentId: cardiology.id, specialization: 'Cardiologist', licenseNumber: 'MD-2024-001' },
  });

  const doc2 = await prisma.user.upsert({
    where: { email: 'dr.smith@helixcare.com' },
    update: {},
    create: { name: 'Dr. Lisa Smith', email: 'dr.smith@helixcare.com', password: hash('doctor123'), role: 'DOCTOR' },
  });
  await prisma.doctor.upsert({
    where: { userId: doc2.id },
    update: {},
    create: { userId: doc2.id, departmentId: general.id, specialization: 'General Practitioner', licenseNumber: 'MD-2024-002' },
  });

  const doc3 = await prisma.user.upsert({
    where: { email: 'dr.chen@helixcare.com' },
    update: {},
    create: { name: 'Dr. Kevin Chen', email: 'dr.chen@helixcare.com', password: hash('doctor123'), role: 'DOCTOR' },
  });
  await prisma.doctor.upsert({
    where: { userId: doc3.id },
    update: {},
    create: { userId: doc3.id, departmentId: neurology.id, specialization: 'Neurologist', licenseNumber: 'MD-2024-003' },
  });

  console.log('✅ Doctors created');
  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });