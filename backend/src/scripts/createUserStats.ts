import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import UserStats from "../models/UserStats";

dotenv.config();

const createUserStats = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");

    const users = await User.find({});
    for (const user of users) {
      const existingStats = await UserStats.findOne({ user: user._id });
      if (!existingStats) {
        await UserStats.create({ user: user._id });
        console.log(`Created stats for user ${user.email}`);
      }
    }

    console.log("User stats creation completed");
    process.exit(0);
  } catch (error) {
    console.error("Error creating user stats:", error);
    process.exit(1);
  }
};

createUserStats();