// index.js

// Importing required dependencies
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';

import csvRoute from './routes/csv.routes.js'
import authRoute from './routes/auth.route.js'
import { authenticateAdmin } from './middlewares/auth.middleware.js';

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS (Cross-Origin Resource Sharing)
app.use(express.json()); // Parse incoming JSON requests

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Hello from the MERN backend!');
});

app.use('/api/csv',csvRoute);
app.use('/api/auth',authRoute);

// Set the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
