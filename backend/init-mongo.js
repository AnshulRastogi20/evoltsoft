// MongoDB initialization script
db = db.getSiblingDB('charging_station_db');

// Create collections
db.createCollection('users');
db.createCollection('chargingstations');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.chargingstations.createIndex({ "location.coordinates": "2dsphere" });
db.chargingstations.createIndex({ "status": 1 });
db.chargingstations.createIndex({ "connectorType": 1 });
db.chargingstations.createIndex({ "createdBy": 1 });

print('Database initialized successfully!');
