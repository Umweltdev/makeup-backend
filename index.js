import express from "express";
import { createServer } from "http";
import { initSocket } from "./utils/socket.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import prepsRoute from "./routes/preps.js"
import servicesRoute from "./routes/services.js";
import invoiceRoute from "./routes/invoice.js";
import inquiryRoute from "./routes/inquiry.js";
import carouselRoute from "./routes/carousel.js";
import bookingsRoute from "./routes/bookings.js";
import mailchimpRoutes from './routes/mailchimp.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);
dotenv.config();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Make-up Booking API',
      version: '1.0.0',
      description: 'API documentation for the Make-up Booking System',
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            country: { type: 'string' },
            status: { 
              type: 'string',
              enum: ["Checked-Out", "Checked-in", "Reserved"]
            },
            img: { type: 'string' },
            phone: { type: 'string' },
            role: {
              type: 'string',
              enum: ["customer", "admin"]
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
            country: { type: 'string' },
            phone: { type: 'string' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/services", servicesRoute);
app.use("/api/preps", prepsRoute);
app.use("/api/invoice", invoiceRoute);
app.use("/api/booking", bookingsRoute);
app.use("/api/inquiry", inquiryRoute);
app.use("/api/carousel", carouselRoute);
app.use('/api/mailchimp', mailchimpRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'Make-up Booking API Documentation',
}));

// Docs in JSON format
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!!!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  connect();
  console.log(`Server is running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});