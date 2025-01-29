import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function insertAdmin() {

    console.log("MONGODB_URI:", process.env.MONGODB_URI);

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);

    const email = "admin@example.com";
    const plainPassword = "admin123";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existingAdmin = await db.collection("xadmins").findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists!");
      return;
    }

    await db.collection("xadmins").insertOne({ email, password: hashedPassword, role: "admin" });
    console.log("Admin inserted successfully!");

    await client.close();
  } catch (error) {
    console.error("Error inserting admin:", error);
  }
}

insertAdmin();
