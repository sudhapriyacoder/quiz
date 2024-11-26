const mongooose = require("mongoose");
require('dotenv').config();

mongooose.connect(process.env.MONGO_URL);

const connection = mongooose.connection;

connection.on('connected', () => {
    console.log('Mongo DB connection successful');
});

connection.on('error', () => {
    console.log('Mongo db connection failed');
});

module.exports = connection;