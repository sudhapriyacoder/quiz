const express = require('express');
const cors = require('cors');


const app = express();
require('dotenv').config();
app.use(cors({
    origin: '*',  // Allow requests from your local frontend
    methods: 'GET,POST,PUT,DELETE',  // Allow specific HTTP methods
    credentials: false  // If you're using cookies or authentication
  }));
app.use(express.json());
const dbconfig = require('./config/dbconfig');

const userRoute = require('./routes/usersRoute');
const examRoute = require('./routes/examRoute');
const reportsRoute = require('./routes/reportsRoute');


app.use('/api/users', userRoute);
app.use('/api/exams', examRoute);
app.use('/api/reports', reportsRoute);
const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`Server is listening on PORT: ${port}`);
});