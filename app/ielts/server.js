const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://Cluster93803:admin@cluster93803.dqtj5jy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster93803';
mongoose.connect(MONGODB_URI, {});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Routes
const resultsLoadCountRouter = require('./routes/resultsLoadCount');
app.use('/api', resultsLoadCountRouter);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});