import { config } from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    username: "emma_thompson",
    email: "emma.thompson@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/women/1.jpg",
      publicId: ""
    },
    bio: "Love connecting with new people and sharing stories!"
  },
  {
    username: "olivia_miller",
    email: "olivia.miller@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/women/2.jpg",
      publicId: ""
    },
    bio: "Passionate about technology and design."
  },
  {
    username: "sophia_davis",
    email: "sophia.davis@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/women/3.jpg",
      publicId: ""
    },
    bio: "Coffee enthusiast and bookworm."
  },
  {
    username: "ava_wilson",
    email: "ava.wilson@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/women/4.jpg",
      publicId: ""
    },
    bio: "Adventurer always looking for the next journey."
  },
  {
    username: "isabella_brown",
    email: "isabella.brown@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/women/5.jpg",
      publicId: ""
    },
    bio: "Artist and creative soul."
  },
  {
    username: "mia_johnson",
    email: "mia.johnson@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/women/6.jpg",
      publicId: ""
    },
    bio: "Music lover and part-time photographer."
  },
  {
    username: "charlotte_williams",
    email: "charlotte.williams@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/women/7.jpg",
      publicId: ""
    },
    bio: "Fitness enthusiast and healthy lifestyle advocate."
  },
  {
    username: "amelia_garcia",
    email: "amelia.garcia@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/women/8.jpg",
      publicId: ""
    },
    bio: "Travel blogger sharing stories from around the world."
  },

  // Male Users
  {
    username: "james_anderson",
    email: "james.anderson@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/men/1.jpg",
      publicId: ""
    },
    bio: "Software developer passionate about clean code."
  },
  {
    username: "william_clark",
    email: "william.clark@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/men/2.jpg",
      publicId: ""
    },
    bio: "Entrepreneur building the next big thing."
  },
  {
    username: "benjamin_taylor",
    email: "benjamin.taylor@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/men/3.jpg",
      publicId: ""
    },
    bio: "Sports fanatic and weekend warrior."
  },
  {
    username: "lucas_moore",
    email: "lucas.moore@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/men/4.jpg",
      publicId: ""
    },
    bio: "Chef experimenting with fusion cuisine."
  },
  {
    username: "henry_jackson",
    email: "henry.jackson@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/men/5.jpg",
      publicId: ""
    },
    bio: "Gamer and tech reviewer."
  },
  {
    username: "alexander_martin",
    email: "alexander.martin@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/men/6.jpg",
      publicId: ""
    },
    bio: "Environmental scientist working for a greener future."
  },
  {
    username: "daniel_rodriguez",
    email: "daniel.rodriguez@example.com",
    password: "123456",
    profilePic: {
      url: "https://randomuser.me/api/portraits/men/7.jpg",
      publicId: ""
    },
    bio: "Teacher inspiring the next generation."
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();