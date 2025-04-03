import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\d\s\-\(\)\+]+$/, 'Please enter a valid phone number']
  },
  institution: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State/Province is required'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'Postal/Zip code is required'],
    trim: true,
    match: [/^[A-Za-z\d\s-]+$/, 'Please enter a valid postal/zip code']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Registration = mongoose.model('Registration', registrationSchema); 