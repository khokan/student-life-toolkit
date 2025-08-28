const mongoose = require('mongoose');
const schedule = require('../models/schedule');

async function connectDB(){
const uri = process.env.MONGODB_URI;
if(!uri) throw new Error('MONGO_URI not set in .env');
await mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology:true});
console.log('MongoDB connected');
}



async function seedData() {
  try {
    // await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
     console.log("✅ data inserted");

    // Clear existing
    await schedule.deleteMany();

    // Insert sample data
    const data = [
  {
    subject: "Math",
    day: "Monday",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    instructor: "Mr. Rahman",
    color: "#4ade80",
  },
  {
    subject: "English",
    day: "Wednesday",
    startTime: "2:00 PM",
    endTime: "3:00 PM",
    instructor: "Ms. Sultana",
    color: "#60a5fa",
  },
];

    await schedule.insertMany(data);
    console.log("✅ Sample data inserted!");
    process.exit();
  } catch (error) {
    console.error("❌ Error inserting sample data:", error);
    process.exit(1);
  }
}

//seedData();

module.exports = { connectDB, seedData };