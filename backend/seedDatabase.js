const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const ChargingStation = require('./models/ChargingStation');

// Sample data
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin@evoltsoft.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'user@evoltsoft.com',
    password: 'user123',
    role: 'user'
  }
];

const sampleStations = [
  {
    name: 'Central Mall Charging Hub',
    location: {
      address: 'Central Mall, Connaught Place, New Delhi, Delhi 110001',
      coordinates: [77.2180, 28.6304]
    },
    status: 'Active',
    powerOutput: 50,
    connectorType: 'CCS',
    pricePerKWh: 8.5,
    isAvailable: true,
    description: 'Fast charging station located at the main entrance of Central Mall. Available 24/7 with covered parking.'
  },
  {
    name: 'DLF Cyber City Station',
    location: {
      address: 'DLF Cyber City, Sector 25, Gurugram, Haryana 122002',
      coordinates: [77.0869, 28.4943]
    },
    status: 'Active',
    powerOutput: 22,
    connectorType: 'Type 2',
    pricePerKWh: 7.0,
    isAvailable: true,
    description: 'Corporate charging facility with Type 2 connectors. Reserved for office employees during business hours.'
  },
  {
    name: 'India Gate Power Point',
    location: {
      address: 'India Gate, Rajpath, New Delhi, Delhi 110003',
      coordinates: [77.2295, 28.6129]
    },
    status: 'Active',
    powerOutput: 30,
    connectorType: 'CHAdeMO',
    pricePerKWh: 9.0,
    isAvailable: false,
    description: 'Tourist area charging station with scenic view. Currently under maintenance for connector upgrade.'
  },
  {
    name: 'Noida Tech Park Fast Charger',
    location: {
      address: 'Sector 62, Noida, Uttar Pradesh 201309',
      coordinates: [77.3648, 28.6227]
    },
    status: 'Active',
    powerOutput: 75,
    connectorType: 'CCS',
    pricePerKWh: 10.0,
    isAvailable: true,
    description: 'High-speed charging station for quick top-ups. Ideal for long-distance travelers and commercial vehicles.'
  },
  {
    name: 'Green Valley Eco Station',
    location: {
      address: 'Green Valley, Faridabad, Haryana 121001',
      coordinates: [77.3178, 28.4089]
    },
    status: 'Maintenance',
    powerOutput: 40,
    connectorType: 'Type 2',
    pricePerKWh: 6.5,
    isAvailable: false,
    description: 'Eco-friendly charging station powered by solar panels. Currently undergoing scheduled maintenance.'
  },
  {
    name: 'Airport Express Charging Hub',
    location: {
      address: 'IGI Airport Terminal 3, New Delhi, Delhi 110037',
      coordinates: [77.1025, 28.5562]
    },
    status: 'Active',
    powerOutput: 60,
    connectorType: 'Tesla',
    pricePerKWh: 12.0,
    isAvailable: true,
    description: 'Premium charging facility at airport terminal. Tesla supercharger with valet parking service available.'
  },
  {
    name: 'Metro Station Quick Charge',
    location: {
      address: 'Rajiv Chowk Metro Station, New Delhi, Delhi 110001',
      coordinates: [77.2197, 28.6328]
    },
    status: 'Active',
    powerOutput: 25,
    connectorType: 'Type 1',
    pricePerKWh: 8.0,
    isAvailable: true,
    description: 'Convenient charging point for metro commuters. Short-term parking available with charging.'
  },
  {
    name: 'University Campus Charger',
    location: {
      address: 'Delhi University, North Campus, Delhi 110007',
      coordinates: [77.2167, 28.6969]
    },
    status: 'Inactive',
    powerOutput: 20,
    connectorType: 'Type 2',
    pricePerKWh: 5.0,
    isAvailable: false,
    description: 'Student and faculty charging station. Currently inactive due to infrastructure upgrade.'
  }
];

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/charging-station-management');
    console.log('📦 Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedUsers() {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create new users with hashed passwords
    const users = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      users.push({
        ...userData,
        password: hashedPassword
      });
    }

    const createdUsers = await User.insertMany(users);
    console.log(`👥 Created ${createdUsers.length} users`);
    
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

async function seedStations(users) {
  try {
    // Clear existing stations
    await ChargingStation.deleteMany({});
    console.log('🗑️  Cleared existing charging stations');

    // Add createdBy field to stations (randomly assign to users)
    const stationsWithCreator = sampleStations.map(station => ({
      ...station,
      createdBy: users[Math.floor(Math.random() * users.length)]._id
    }));

    const createdStations = await ChargingStation.insertMany(stationsWithCreator);
    console.log(`⚡ Created ${createdStations.length} charging stations`);
    
    return createdStations;
  } catch (error) {
    console.error('❌ Error seeding stations:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    const users = await seedUsers();
    const stations = await seedStations(users);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   ⚡ Charging Stations: ${stations.length}`);
    console.log('\n🔐 Test Accounts:');
    console.log('   Admin: admin@evoltsoft.com / admin123');
    console.log('   User:  user@evoltsoft.com / user123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n📦 Database connection closed');
    process.exit(0);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
