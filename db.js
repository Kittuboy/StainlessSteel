const mongoose = require ('mongoose');


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongo_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // exit app if connection fails
  }
};

module.exports = connectDB;