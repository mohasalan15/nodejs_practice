import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const client = new MongoClient("mongodb://localhost:27017");

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connection OK");

    const db = client.db("university");
    const students = db.collection("students");

    // insert many
    const insertedBatch = await students.insertMany([
      { name: "Faisa", age: 21, department: "Engineering", year: 2 },
      { name: "Sahal", age: 19, department: "Engineering", year: 1 },
      { name: "Ruqiya", age: 20, department: "Engineering", year: 3 },
    ]);
    console.log("Added:", insertedBatch.insertedCount);

    // get all
    const all = await students.find().toArray();
    console.log(all);

    // find one
    const single = await students.findOne({ name: "Isra" });
    console.log("Single:", single);

    // get specific fields
    const basicInfo = await students
      .find({}, { projection: { name: 1, age: 1, _id: 0 } })
      .toArray();
    console.log(basicInfo);

    // update one
    const updatedOne = await students.updateOne(
      { name: "Isra" },
      { $set: { age: 18 } }
    );
    console.log("Updated (one):", updatedOne.modifiedCount);

    // update many
    const updatedMany = await students.updateMany(
      { age: 22 },
      { $set: { year: 4 } }
    );
    console.log("Updated (many):", updatedMany.modifiedCount);

    // delete one
    const removedOne = await students.deleteOne({ name: "Hawa" });
    console.log("Deleted (one):", removedOne.deletedCount);

    // delete many
    const removedBatch = await students.deleteMany({ age: 16 });
    console.log("Deleted (many):", removedBatch.deletedCount);
  } catch (err) {
    console.error("Database error:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

run();

const port = 4000;
app.listen(port, () => {
  console.log("Server running on port ${port}");
});
