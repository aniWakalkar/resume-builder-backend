import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import qrPaymentRoutes from './routes/qrPaymentRoutes.js';
import { errorMiddleware, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.LOCAL_CLIENT_URL || 'http://localhost:5173',
  process.env.DEVELOPMENT_CLIENT_URL || 'http://localhost:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/payments', qrPaymentRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running', status: 'OK' });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date(),
    features: ['Authentication', 'Resume CRUD', 'Templates']
  });
});


app.get('/', (req, res) => {
  res.json({
    message: 'Resume Maker API is running',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      templates: {
        all: 'GET /api/templates',
        free: 'GET /api/templates/free',
        premium: 'GET /api/templates/premium'
      },
      resumes: {
        create: 'POST /api/resumes',
        getAll: 'GET /api/resumes',
        getOne: 'GET /api/resumes/:id',
        update: 'PUT /api/resumes/:id',
        delete: 'DELETE /api/resumes/:id'
      },
      payments: {
        createQR: 'POST /api/payments/create-qr',
        verify: 'POST /api/payments/verify-qr',
        status: 'GET /api/payments/status/:paymentId',
        purchased: 'GET /api/payments/purchased'
      }
    }
  });
});

// Error middleware
app.use(notFound);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});