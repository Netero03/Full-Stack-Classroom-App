const mongoose = require('mongoose');
const User = require('../src/models/User'); // Adjust the path as needed

const seedData = async () => {
    try {
        await mongoose.connect('mongodb+srv://jatinletsgo:8IOPSHkivs1yH1tM@classroom-cluster.5rrte.mongodb.net/?retryWrites=true&w=majority&appName=Classroom-Cluster');

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
