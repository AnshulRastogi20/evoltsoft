@echo off
echo 🔌 Testing MongoDB Atlas Connection...

REM Navigate to backend directory
cd backend

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Create test connection script
(
echo const mongoose = require('mongoose'^);
echo.
echo const mongoURI = 'mongodb+srv://anshulrastogi20:TUEwtr4LX4Itz3hU@cluster0.jcqy0da.mongodb.net/evoltsoft?retryWrites=true&w=majority';
echo.
echo console.log('🔌 Testing MongoDB Atlas connection...'^);
echo console.log('📍 Cluster:', mongoURI.split('@'^)[1].split('/'^)[0]^);
echo.
echo mongoose.connect(mongoURI, {
echo   useNewUrlParser: true,
echo   useUnifiedTopology: true,
echo   serverSelectionTimeoutMS: 10000
echo }^)
echo .then((^) =^> {
echo   console.log('✅ MongoDB Atlas connection successful!'^);
echo   console.log('📊 Database:', mongoose.connection.name^);
echo   console.log('🏠 Host:', mongoose.connection.host^);
echo   mongoose.connection.close(^);
echo   process.exit(0^);
echo }^)
echo .catch((error^) =^> {
echo   console.error('❌ MongoDB Atlas connection failed:'^);
echo   console.error(error.message^);
echo   process.exit(1^);
echo }^);
) > test-connection.js

REM Run the test
node test-connection.js

REM Clean up
del test-connection.js

echo 🎉 MongoDB connection test completed!
pause
