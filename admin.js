const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
require("dotenv").config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.username);
      await mongoose.disconnect();
      process.exit();
    }

    // Use env var for password if available, fallback to hardcoded
    const password = process.env.ADMIN_PASSWORD || "Ha1234";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = new User({
      username: "HaYu",
      hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created:", adminUser.username);

    await mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error("Error seeding admin:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();