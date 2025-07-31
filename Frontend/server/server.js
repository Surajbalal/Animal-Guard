import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data for NGOs (since we don't have a database setup yet)
const mockNgos = [
  {
    _id: '1',
    name: 'Animal Rescue Foundation',
    description: 'Dedicated to rescuing and rehabilitating stray animals across the city.',
    email: 'contact@animalrescue.org',
    contactPhone: '+91-9876543210',
    address: {
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    rescueCategories: ['Dogs', 'Cats', 'All Animals'],
    rescueDistance: 25,
    casesHandled: 150,
    serviceHours: '24/7 Emergency Response',
    status: 'approved'
  },
  {
    _id: '2',
    name: 'Wildlife Protection Society',
    description: 'Specialized in wildlife rescue and conservation efforts.',
    email: 'info@wildlifeprotection.org',
    contactPhone: '+91-9876543211',
    address: {
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    rescueCategories: ['Wildlife', 'Birds'],
    rescueDistance: 50,
    casesHandled: 89,
    serviceHours: '9 AM - 6 PM',
    status: 'approved'
  },
  {
    _id: '3',
    name: 'Paws & Hearts Shelter',
    description: 'A loving shelter providing care for abandoned pets and strays.',
    email: 'hello@pawsandhearts.org',
    contactPhone: '+91-9876543212',
    address: {
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    rescueCategories: ['Dogs', 'Cats'],
    rescueDistance: 30,
    casesHandled: 200,
    serviceHours: '8 AM - 8 PM',
    status: 'approved'
  },
  {
    _id: '4',
    name: 'Farm Animal Welfare Trust',
    description: 'Protecting and caring for farm animals and livestock.',
    email: 'support@farmwelfare.org',
    contactPhone: '+91-9876543213',
    address: {
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001'
    },
    rescueCategories: ['Farm Animals', 'All Animals'],
    rescueDistance: 40,
    casesHandled: 75,
    serviceHours: '6 AM - 10 PM',
    status: 'approved'
  },
  {
    _id: '5',
    name: 'Street Dogs Care Foundation',
    description: 'Focused on street dog vaccination, sterilization, and care.',
    email: 'care@streetdogs.org',
    contactPhone: '+91-9876543214',
    address: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001'
    },
    rescueCategories: ['Dogs'],
    rescueDistance: 20,
    casesHandled: 300,
    serviceHours: '24/7 Emergency Response',
    status: 'approved'
  }
];

// Routes
app.get('/')
app.get('/api/ngos/approved', (req, res) => {
  try {
    // Filter only approved NGOsqwwŵ
    const approvedNgos = mockNgos.filter(ngo => ngo.status === 'approved');
    res.json(approvedNgos);
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'AnimalGuard API Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});