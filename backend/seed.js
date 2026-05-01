const bcrypt = require('bcryptjs');
const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();

const seed = async () => {
  try {
    console.log('Seeding Mock Database...');

    db.clearDb();

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const driverPassword = await bcrypt.hash('driver123', 10);

    const admin = db.saveUser({
      name: 'Vandi Go Admin',
      email: 'admin@vandigo.com',
      password: hashedPassword,
      phone: '+91 9000012345',
      role: 'admin'
    });

    const driver = db.saveUser({
      name: 'Driver John',
      email: 'driver@vandigo.com',
      password: driverPassword,
      phone: '+91 8000054321',
      role: 'driver'
    });

    // Create a demo trip
    db.saveTrip({
      pickupLocation: 'Airport T3',
      dropLocation: 'Luxury Hotel CBD',
      fareAmount: 1200,
      tripType: 'One way',
      carType: 'SUV Premium',
      customerName: 'Alice Smith',
      customerPhone: '+91 9876543210',
      bookingDateTime: new Date().toISOString(),
      driver: driver._id,
      status: 'Assigned',
      showCustomerDetails: false, // NEW FIELD
      createdBy: admin._id
    });

    console.log('Seed successful! You can now login with:');
    console.log('Admin: admin@vandigo.com / admin123');
    console.log('Driver: driver@vandigo.com / driver123');
    process.exit();
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
