const mongoose = require('mongoose');

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ MongoDB Connected");

    // Clear existing
    await Schedule.deleteMany();

    // Insert sample data
    const data = [
      {
        subject: "Math",
        day: "Monday",
        time: "10:00 AM",
        instructor: "Mr. Rahman",
        color: "#4ade80",
      },
      {
        subject: "English",
        day: "Wednesday",
        time: "2:00 PM",
        instructor: "Ms. Sultana",
        color: "#60a5fa",
      },
    ];

    await Schedule.insertMany(data);
    console.log("✅ Sample data inserted!");
    process.exit();
  } catch (error) {
    console.error("❌ Error inserting sample data:", error);
    process.exit(1);
  }
}

seedData();