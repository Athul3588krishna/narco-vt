require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const PoliceStation = require('../models/PoliceStation');
const authService = require('../services/authService');

const usersToSeed = [
  {
    name: 'NarcoVT Super Admin',
    email: 'superadmin@narcovt.gov',
    password: 'SuperAdminPassword123!',
    role: 'superadmin',
    phone: '4445556666',
    isVerified: true
  },
  {
    name: 'Kerala Police Officer',
    email: 'admin@narcovt.gov',
    password: 'AdminPassword123!',
    role: 'admin',
    phone: '9998887777',
    policeStation: 'Cantonment Police Station',
    isVerified: true
  },
  {
    name: 'Test Citizen User',
    email: 'citizen@narcovt.gov',
    password: 'CitizenPassword123!',
    role: 'citizen',
    phone: '1112223333',
    isVerified: true
  }
];

const seedAdmins = async () => {
  try {
    // Connect to database
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/narco_vt');
    console.log('Database connected.');

    // Remove existing test accounts to avoid duplicates
    console.log('Cleaning existing user records...');
    await User.deleteMany({ role: { $in: ['admin', 'superadmin', 'citizen'] } });

    // Seed users
    for (const userData of usersToSeed) {
      const hashedPassword = await authService.hashPassword(userData.password);
      
      const seededUser = await User.create({
        ...userData,
        password: hashedPassword
      });
      
      console.log(`Seeded user: ${seededUser.role} -> ${userData.email}`);
    }

    console.log('Cleaning existing police stations...');
    await PoliceStation.deleteMany({});

    const policeStations = [
      // Thiruvananthapuram
      { name: 'Cantonment Police Station', district: 'Thiruvananthapuram', latitude: 8.5013, longitude: 76.9511 },
      { name: 'Museum Police Station', district: 'Thiruvananthapuram', latitude: 8.5085, longitude: 76.9535 },
      { name: 'Fort Police Station', district: 'Thiruvananthapuram', latitude: 8.4829, longitude: 76.9454 },
      { name: 'Medical College Police Station', district: 'Thiruvananthapuram', latitude: 8.5222, longitude: 76.9272 },

      // Kollam
      { name: 'Kollam East Police Station', district: 'Kollam', latitude: 8.8893, longitude: 76.5916 },
      { name: 'Kollam West Police Station', district: 'Kollam', latitude: 8.8860, longitude: 76.5780 },
      { name: 'Karunagappally Police Station', district: 'Kollam', latitude: 9.0558, longitude: 76.5367 },

      // Pathanamthitta
      { name: 'Pathanamthitta Police Station', district: 'Pathanamthitta', latitude: 9.2648, longitude: 76.7870 },
      { name: 'Adoor Police Station', district: 'Pathanamthitta', latitude: 9.1534, longitude: 76.7325 },
      { name: 'Thiruvalla Police Station', district: 'Pathanamthitta', latitude: 9.3833, longitude: 76.5794 },

      // Alappuzha
      { name: 'Alappuzha South Police Station', district: 'Alappuzha', latitude: 9.4907, longitude: 76.3328 },
      { name: 'Alappuzha North Police Station', district: 'Alappuzha', latitude: 9.5081, longitude: 76.3364 },
      { name: 'Cherthala Police Station', district: 'Alappuzha', latitude: 9.6865, longitude: 76.3333 },
      { name: 'Kayamkulam Police Station', district: 'Alappuzha', latitude: 9.1722, longitude: 76.4994 },

      // Kottayam
      { name: 'Kottayam West Police Station', district: 'Kottayam', latitude: 9.5833, longitude: 76.5167 },
      { name: 'Kottayam East Police Station', district: 'Kottayam', latitude: 9.5914, longitude: 76.5292 },
      { name: 'Changanassery Police Station', district: 'Kottayam', latitude: 9.4447, longitude: 76.5386 },
      

      // Idukki
      { name: 'Thodupuzha Police Station', district: 'Idukki', latitude: 9.8974, longitude: 76.7118 },
      { name: 'Munnar Police Station', district: 'Idukki', latitude: 10.0889, longitude: 77.0595 },
      { name: 'Kattappana Police Station', district: 'Idukki', latitude: 9.7794, longitude: 77.1167 },

      // Ernakulam
      { name: 'Ernakulam Central Police Station', district: 'Ernakulam', latitude: 9.9796, longitude: 76.2828 },
      { name: 'Ernakulam North Police Station', district: 'Ernakulam', latitude: 9.9961, longitude: 76.2892 },
      { name: 'Kochi Harbour Police Station', district: 'Ernakulam', latitude: 9.9422, longitude: 76.2690 },
      { name: 'Aluva Police Station', district: 'Ernakulam', latitude: 10.1076, longitude: 76.3503 },
      { name: 'Muvattupuzha Police Station', district: 'Ernakulam', latitude: 9.9806, longitude: 76.5794 },

      // Thrissur
      { name: 'Thrissur East Police Station', district: 'Thrissur', latitude: 10.5230, longitude: 76.2208 },
      { name: 'Thrissur West Police Station', district: 'Thrissur', latitude: 10.5186, longitude: 76.2081 },
      { name: 'Guruvayur Police Station', district: 'Thrissur', latitude: 10.5964, longitude: 76.0372 },
      { name: 'Irinjalakuda Police Station', district: 'Thrissur', latitude: 10.3428, longitude: 76.2033 },

      // Palakkad
      { name: 'Palakkad Town South Police Station', district: 'Palakkad', latitude: 10.7719, longitude: 76.6548 },
      { name: 'Palakkad Town North Police Station', district: 'Palakkad', latitude: 10.7892, longitude: 76.6534 },
      { name: 'Ottapalam Police Station', district: 'Palakkad', latitude: 10.7761, longitude: 76.3814 },

      // Malappuram
      { name: 'Malappuram Police Station', district: 'Malappuram', latitude: 11.0732, longitude: 76.0740 },
      { name: 'Manjeri Police Station', district: 'Malappuram', latitude: 11.1214, longitude: 76.1206 },
      { name: 'Tirur Police Station', district: 'Malappuram', latitude: 10.9030, longitude: 75.9238 },
      { name: 'Perinthalmanna Police Station', district: 'Malappuram', latitude: 10.9764, longitude: 76.2238 },

      // Kozhikode
      { name: 'Kozhikode Town Police Station', district: 'Kozhikode', latitude: 11.2530, longitude: 75.7769 },
      { name: 'Kasaba Police Station', district: 'Kozhikode', latitude: 11.2589, longitude: 75.7894 },
      { name: 'Nadakkavu Police Station', district: 'Kozhikode', latitude: 11.2681, longitude: 75.7831 },
      { name: 'Vadakara Police Station', district: 'Kozhikode', latitude: 11.6030, longitude: 75.5921 },

      // Wayanad
      { name: 'Kalpetta Police Station', district: 'Wayanad', latitude: 11.6094, longitude: 76.0825 },
      { name: 'Mananthavady Police Station', district: 'Wayanad', latitude: 11.8028, longitude: 76.0042 },
      { name: 'Sulthan Bathery Police Station', district: 'Wayanad', latitude: 11.6661, longitude: 76.2575 },

      // Kannur
      { name: 'Kannur Town Police Station', district: 'Kannur', latitude: 11.8689, longitude: 75.3555 },
      { name: 'Thalassery Police Station', district: 'Kannur', latitude: 11.7494, longitude: 75.4894 },
      { name: 'Payyannur Police Station', district: 'Kannur', latitude: 12.1022, longitude: 75.2014 },

      // Kasaragod
      { name: 'Kasaragod Police Station', district: 'Kasaragod', latitude: 12.5028, longitude: 74.9919 },
      { name: 'Kanhangad Police Station', district: 'Kasaragod', latitude: 12.3161, longitude: 75.0931 }
    ];

    console.log('Seeding police stations...');
    await PoliceStation.insertMany(policeStations);
    console.log(`Seeded ${policeStations.length} police stations.`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedAdmins();
