const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const ChargingStation = require('./models/ChargingStation');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding for production...');

    // Clear existing data
    await User.deleteMany({});
    await ChargingStation.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@evoltsoft.com',
      password: hashedAdminPassword,
      role: 'admin'
    });

    // Create regular user
    const hashedUserPassword = await bcrypt.hash('user123', 12);
    const regularUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'user@evoltsoft.com',
      password: hashedUserPassword,
      role: 'user'
    });

    console.log('✅ Created users');

    // Create charging stations with real locations in India
    const stations = [
      {
        name: 'Delhi Metro Station Charger',
        location: {
          address: 'Rajiv Gandhi International Airport, Hyderabad, Telangana',
          coordinates: [78.4293, 17.2403]
        },
        status: 'Active',
        powerOutput: 50,
        connectorType: 'Type 2',
        pricePerKWh: 8.5,
        isAvailable: true,
        description: 'Fast charging station at the airport',
        createdBy: adminUser._id
      },
      {
        name: 'Mumbai Central Mall Charger',
        location: {
          address: 'Phoenix Mills, Lower Parel, Mumbai, Maharashtra',
          coordinates: [72.8331, 19.0144]
        },
        status: 'Active',
        powerOutput: 75,
        connectorType: 'CCS',
        pricePerKWh: 9.0,
        isAvailable: true,
        description: 'Shopping mall charging facility',
        createdBy: adminUser._id
      },
      {
        name: 'Bangalore Tech Park Charger',
        location: {
          address: 'Electronic City, Bangalore, Karnataka',
          coordinates: [77.6648, 12.8456]
        },
        status: 'Active',
        powerOutput: 100,
        connectorType: 'CCS',
        pricePerKWh: 7.8,
        isAvailable: true,
        description: 'Tech park employee charging station',
        createdBy: adminUser._id
      },
      {
        name: 'Chennai Express Highway Charger',
        location: {
          address: 'OMR, Sholinganallur, Chennai, Tamil Nadu',
          coordinates: [80.2275, 12.9009]
        },
        status: 'Active',
        powerOutput: 150,
        connectorType: 'CHAdeMO',
        pricePerKWh: 10.2,
        isAvailable: true,
        description: 'Highway fast charging station',
        createdBy: adminUser._id
      },
      {
        name: 'Pune University Campus Charger',
        location: {
          address: 'Pune University, Ganeshkhind, Pune, Maharashtra',
          coordinates: [73.8567, 18.5089]
        },
        status: 'Maintenance',
        powerOutput: 25,
        connectorType: 'Type 1',
        pricePerKWh: 6.5,
        isAvailable: false,
        description: 'University campus charging point - under maintenance',
        createdBy: adminUser._id
      }
    ];

    await ChargingStation.insertMany(stations);
    console.log('✅ Created charging stations');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users created: ${await User.countDocuments()}`);
    console.log(`⚡ Charging stations created: ${await ChargingStation.countDocuments()}`);
    console.log('\n🔑 Test accounts:');
    console.log('Admin: admin@evoltsoft.com / admin123');
    console.log('User: user@evoltsoft.com / user123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding function
connectDB().then(() => {
  seedDatabase();
});
