const mongoose = require('mongoose');
const User = require('../src/models/User'); // Adjust the path as needed
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Create Principal without manual hashing
        const principal = new User({
            name: 'Principal',
            email: 'principal1@classroom.com',
            password: 'admin',  // Plain text password
            role: 'Principal',
        });

        await principal.save();
        console.log('Data seeded successfully');
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        mongoose.connection.close();
    }
};

seedData();
