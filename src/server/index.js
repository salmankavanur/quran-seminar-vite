import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../lib/db.js';
import Message from '../models/Message.js';
import { Registration } from '../models/Registration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

let isConnected = false;

// Connect to MongoDB and start server
async function startServer() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    isConnected = true;
    console.log('MongoDB connection successful');

    const PORT = parseInt(process.env.PORT) || 5001;
    const HOST = process.env.HOST || 'localhost';
    
    app.listen(PORT)
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
          app.listen(PORT + 1, () => {
            console.log(`Server running on port ${PORT + 1}`);
            console.log(`Test the API at http://${HOST}:${PORT + 1}/api/test`);
          });
        } else {
          console.error('Server error:', err);
        }
      })
      .on('listening', () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Test the API at http://${HOST}:${PORT}/api/test`);
      });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  if (!isConnected) {
    return res.status(503).json({ error: 'Database not connected. Please try again later.' });
  }

  try {
    console.log('Received registration data:', req.body);
    const { fullName, email, phone, institution, address, city, state, zipCode } = req.body;
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({ error: 'Missing required fields', details: missingFields });
    }

    // Check if registration already exists
    const existingRegistration = await Registration.findOne({ email });
    if (existingRegistration) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new registration
    const newRegistration = new Registration({
      fullName,
      email,
      phone,
      institution,
      address,
      city,
      state,
      zipCode
    });

    // Validate the registration before saving
    const validationError = newRegistration.validateSync();
    if (validationError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: Object.values(validationError.errors).map(err => err.message)
      });
    }

    // Save the registration
    await newRegistration.save();
    console.log('New registration created successfully:', newRegistration);

    res.status(201).json({
      message: 'Registration successful',
      registration: newRegistration
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    res.status(500).json({ 
      error: 'Failed to create registration', 
      details: error.message 
    });
  }
});

// Get all registrations
app.get('/api/registrations', async (req, res) => {
  if (!isConnected) {
    return res.status(503).json({ error: 'Database not connected. Please try again later.' });
  }

  try {
    console.log('Fetching registrations...');
    const registrations = await Registration.find().sort({ createdAt: -1 });
    console.log(`Found ${registrations.length} registrations`);
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations', details: error.message });
  }
});

// Create new message
app.post('/api/messages', async (req, res) => {
  if (!isConnected) {
    return res.status(503).json({ error: 'Database not connected. Please try again later.' });
  }

  try {
    console.log('Received message data:', req.body);
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      console.log('Missing required fields:', { name, email, message });
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Create new message
    const newMessage = await Message.create({
      name,
      email,
      message
    });

    console.log('New message created successfully:', newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }
    if (error.name === 'MongoError') {
      return res.status(500).json({ error: 'Database error', details: error.message });
    }
    res.status(500).json({ error: 'Failed to create message', details: error.message });
  }
});

// Routes
// Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    console.log('Fetching messages...');
    const messages = await Message.find().sort({ createdAt: -1 });
    console.log(`Found ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});

// Mark message as read/unread
app.patch('/api/messages/:id/read', async (req, res) => {
  try {
    const { read } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message', details: error.message });
  }
});

// Delete message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message', details: error.message });
  }
});

// Reply to message
app.post('/api/messages/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { 
        reply,
        repliedAt: new Date(),
        read: true
      },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({ error: 'Failed to reply to message', details: error.message });
  }
});

// Start the server
startServer(); 