const mongoose = require('mongoose');

const uri = 'mongodb+srv://user:1234@cluster0.dnxehqi.mongodb.net/?appName=Cluster0';

async function wipe() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas...');

    const db = mongoose.connection.db;

    // List all collections
    const collections = await db.listCollections().toArray();
    for (let collection of collections) {
      if (['users', 'pendingusers', 'bookings'].includes(collection.name)) {
        await db.collection(collection.name).deleteMany({});
        console.log(`Cleared ${collection.name} collection`);
      }
    }

    console.log('Database wiped successfully for fresh testing!');
    process.exit(0);
  } catch (error) {
    console.error('Error wiping database:', error);
    process.exit(1);
  }
}

wipe();
