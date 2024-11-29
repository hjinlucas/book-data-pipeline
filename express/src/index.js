// index.js
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bookRoutes from './routes/bookRoutes.js';

config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://root:123456!@cluster0.g8sci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Large JSON Support!');
});

app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
