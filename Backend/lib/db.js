import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    //  Rename the collection here if needed
    const oldName = "jogabiro";
    const newName = "ChatApp";

    const collections = await mongoose.connection.db
      .listCollections({ name: oldName })
      .toArray();

    if (collections.length > 0) {
      await mongoose.connection.db.renameCollection(oldName, newName);
      console.log(`Collection renamed from ${oldName} to ${newName}`);
    } else {
      console.log(`Collection "${oldName}" not found.`);
    }

  } catch (err) {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  }
};

export { connectDB };
