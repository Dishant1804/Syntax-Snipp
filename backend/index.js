import express from "express";
import authRoutes from "./api/v1/authroutes.js";
import snippetRoutes from "./api/v1/snippetroutes.js";
import paymentRoutes from "./api/v1/paymentroutes.js";
import passport from "./api/v1/config/passportConfig.js";
import './subscriptionCron.js';
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";


const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:54321',
  'https://www.syntax-snipp.xyz',
  'https://backend.syntax-snipp.xyz',
  'https://checkout.razorpay.com'
]

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS Middleware - Request Origin Header:", requestOrigin);
    if (!requestOrigin) {
      console.log("CORS Middleware - No origin header present. Denying for credentialed request.");
      return callback(new Error('Not allowed by CORS: Origin header missing for credentialed request.'));
    }
    if (allowedOrigins.includes(requestOrigin)) {
      console.log(`CORS Middleware - Origin ${requestOrigin} IS ALLOWED.`);
      callback(null, true);
    } else {
      console.log(`CORS Middleware - Origin ${requestOrigin} IS NOT ALLOWED.`);
      callback(new Error(`Not allowed by CORS: Origin ${requestOrigin} not in allowed list.`));
    }

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(passport.initialize());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/snippet", snippetRoutes);
app.use("/api/v1/payments", paymentRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
