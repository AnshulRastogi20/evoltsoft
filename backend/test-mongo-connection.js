const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://anshulrastogi20:TUEwtr4LX4Itz3hU@cluster0.jcqy0da.mongodb.net/evoltsoft?retryWrites=true&w=majority';

console.log('🔌 Testing MongoDB Atlas connection...');
console.log('📍 Cluster:', mongoURI.split('@')[1].split('/')[0]);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000
})
.then(() => {
  console.log('✅ MongoDB Atlas connection successful!');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('🏠 Host:', mongoose.connection.host);
  mongoose.connection.close();
  process.exit(0);
})
.catch((error) => {
  console.error('❌ MongoDB Atlas connection failed:');
  console.error(error.message);
  process.exit(1);
});
